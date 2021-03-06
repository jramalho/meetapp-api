import { badRequest } from '@hapi/boom';

import Meetup from '../models/Meetup';

class MeetupExists {
  async run({ id }) {
    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      throw badRequest('Meetup does not exists');
    }

    return meetup;
  }
}

export default new MeetupExists();
