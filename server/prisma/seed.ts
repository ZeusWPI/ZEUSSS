import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const seedDevData = async () => {
  await prisma.team.createMany({
    data: [
      {
        name: "team 1",
        league: "m",
      },
      {
        name: "team 2",
        league: "m",
      },
      {
        name: "team 3",
        league: "m",
      },
      {
        name: "team 4",
        league: "m",
      },
      {
        name: "team 5",
        league: "m",
      },
      {
        name: "team 6",
        league: "m",
      },
      {
        name: "team 7",
        league: "m",
      },
      {
        name: "team 8",
        league: "m",
      },
    ],
  });
};

seedDevData();
