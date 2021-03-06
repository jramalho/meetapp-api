import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import jwtoken from '../utils/jwtoken';

describe('Scheduled', () => {
  it("should return user's scheduled meetups", async () => {
    const { id } = await factory.create('User');
    const token = jwtoken(id);

    await factory.createMany('Meetup', 5, {
      user_id: id,
    });

    const response = await request(app)
      .get('/scheduled')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toContainEqual(
      expect.objectContaining({ user_id: id })
    );
  });

  it("should return one user's scheduled meetup", async () => {
    const { id } = await factory.create('User');
    const { id: banner_id } = await factory.create('File');
    const token = jwtoken(id);

    const {
      id: meetup_id,
      date,
      localization,
      description,
      title,
    } = await factory.create('Meetup', {
      user_id: id,
      banner_id,
    });

    const response = await request(app)
      .get(`/scheduled/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toMatchObject({
      id: meetup_id,
      localization,
      description,
      title,
      user_id: id,
      banner_id,
      date: date.toISOString(),
    });
  });
});
