self.addEventListener("push", async (e) => {
  const data = e.data.json();

  await self.registration.showNotification(data.name, {
    body: "This task is almost due!",
    icon: "/hourglass.png",
    tag: data.uuid,
  });
});
