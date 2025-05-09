import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.exercise.createMany({
    data: [
      {
        name: "Seated Row",
        muscleGroup: "Back",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkdLj0IhDgDrk7c4XwqaQeAHWJLVZpICzoiTuS",
      },
      {
        name: "Squat",
        muscleGroup: "Legs",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkbqbs8qhiu20hca3PtQYXZ6xGWqBelIpvUJOS",
      },
      {
        name: "Seated Pull-Up",
        muscleGroup: "Back",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkenyJ7dagt1dElfRVpIFsojMKqnyPu3TiYZvU",
      },
      {
        name: "Incline Barbell Chest Press",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkYGfV38mrkE2pS436X9xh7TRHwVmc0bNUiJYz",
      },
      {
        name: "Chest Fly",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkXKT7B7L6UrFcngQTB8H1yAtREpzWwJjiolZ0",
      },
      {
        name: "Leg Curl",
        muscleGroup: "Hamstrings",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrk934JqglJWiDREaIHjOAN1wdkzqQlV7YuP5bK",
      },
      {
        name: "Deadlift",
        muscleGroup: "Full Body",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrk5btsKoeyGfVknRWxISu0wgtDMrZeAs6jQ3om",
      },
      {
        name: "Overhead Barbell Shoulder Press",
        muscleGroup: "Shoulders",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkOi6Sl7Tejg4Jdx8zbAiorP7WNHlSCnmTXMQ6",
      },
      {
        name: "Decline Bench Press",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkIwoNOCZpDrVF8PXRWKYt9wygd63blSMUuBvm",
      },
      {
        name: "Bench Press",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkTPwMqhcKfMXLAhp6aqY8sR1gPGewcQ3xjDIv",
      },
      {
        name: "Incline Bench Press",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkSvDkP6yjRUKaP0WGEmJfkOr39vZVhwFpMB5l",
      },
      {
        name: "Dips",
        muscleGroup: "Triceps",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkYLnWCKYmrkE2pS436X9xh7TRHwVmc0bNUiJY",
      },
      {
        name: "Shoulder Flys",
        muscleGroup: "Shoulders",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrky7YzSwtf0wLhm38irgCQ6WukS5BdFZqo4Xv9",
      },
      {
        name: "Biceps Dumbell Curl",
        muscleGroup: "Biceps",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkbbFn6Yhiu20hca3PtQYXZ6xGWqBelIpvUJOS",
      },
      {
        name: "Seated Crunch Machine",
        muscleGroup: "Abs",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkjnjlKy8bMOYlny9rdCe3JsLzoQ6E0Twiqhku",
      },
      {
        name: "Seated Chest Press",
        muscleGroup: "Chest",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkzVy3Ldi6ULGDginqKxHfFob2vX5JN9chSMrP",
      },
      {
        name: "Leg Press",
        muscleGroup: "Legs",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkjH0DEKV8bMOYlny9rdCe3JsLzoQ6E0Twiqhk",
      },
      {
        name: "Stead Overhead Barbell Shoulder Press",
        muscleGroup: "Shoulders",
        iconUrl:
          "https://ujw76y5xdc.ufs.sh/f/dh0CsXkDgDrkygxphMtf0wLhm38irgCQ6WukS5BdFZqo4Xv9",
      },
    ],
  });

  console.log("✅ Exercises seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
