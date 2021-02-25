import { scheduleJob } from "node-schedule";
import { PushSubscription, sendNotification } from "web-push";

import Schedule from "../entity/Schedule";
import Task from "../entity/Task";

export async function scheduleNotification(date: Date, task: Task, subscription: PushSubscription) {
  try {
    const schedule = Schedule.create({ date, task });
    await schedule.save();

    scheduleJob(schedule.uuid, date, async () => {
      await sendNotification(subscription, JSON.stringify(task));
      await schedule.remove();
    });
  } catch (err) {
    throw err;
  }
}
