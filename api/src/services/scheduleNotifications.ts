import { scheduleJob, scheduledJobs } from "node-schedule";
import { PushSubscription, sendNotification } from "web-push";
import isDatePast from "../utils/isDatePast";

import Schedule from "../entity/Schedule";
import Task from "../entity/Task";

export function getNotifications() {
  return scheduledJobs;
}

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

export async function deleteNotification(uuid: string) {
  try {
    const schedule = await Schedule.findOneOrFail({ uuid });
    const jobs = getNotifications();
    const currentJob = jobs[uuid];

    if (!currentJob) throw new Error("Job not found!");

    await schedule.remove();
    currentJob.cancel();
  } catch (err) {
    throw err;
  }
}
