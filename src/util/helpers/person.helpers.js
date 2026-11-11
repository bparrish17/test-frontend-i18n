import { hhmmToUTCMinutes, getIanaTzName } from '@util/helpers/datetime.helpers';
import { patch } from '@services/query-services/default.query-service';

export async function addDigestConfigToNewUser(user) {
  const digestConfig = user?.digest_configs;
  const tenant = user?.tenants[0];
  const tzId = user?.time_zone_id ?? tenant?.time_zone_id;
  const ianaTzName = getIanaTzName(tzId);

  if (!digestConfig?.morning && !digestConfig?.evening) {
    return patch({
      model: 'people',
      id: user?.id,
      body: {
        digest_configs: {
          morning: { time_of_day: hhmmToUTCMinutes('07:00', ianaTzName) },
          evening: { time_of_day: hhmmToUTCMinutes('19:00', ianaTzName) },
          last_minute_prep: false
        }
      }
    });
  }
}
