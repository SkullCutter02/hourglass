import { scheduleJob } from "node-schedule";
import { PushSubscription, sendNotification } from "web-push";
import isDatePast from "../utils/isDatePast";

import Schedule from "../entity/Schedule";
import Task from "../entity/Task";

export async function scheduleNotification(date: Date, task: Task, subscription: PushSubscription) {
  try {
    const schedule = Schedule.create({ date, task, subscription: JSON.stringify(subscription) });
    await schedule.save();

    scheduleJob(schedule.uuid, date, async () => {
      await sendNotification(subscription, JSON.stringify(task));
      await schedule.remove();
    });
  } catch (err) {
    throw err;
  }
}

export async function rescheduleNotifications() {
  try {
    const schedules = await Schedule.find({ relations: ["task"] });

    schedules.forEach((schedule) => {
      const date = isDatePast(schedule.date) ? new Date(Date.now()).getTime() + 5000 : schedule.date;

      scheduleJob(schedule.uuid, date, async () => {
        await sendNotification(JSON.parse(schedule.subscription), JSON.stringify(schedule.task));
        await schedule.remove();
      });
    });
  } catch (err) {
    throw err;
  }
}
