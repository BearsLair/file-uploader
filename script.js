import { prisma } from "./lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      password: "password",
      files: {
        create: {
          name: "test.txt",
          path: "test.txt",
        },
      },
    },
    include: {
      files: true,
    },
  });
  console.log("User created: ", user);

  const getUsers = await prisma.user.findMany({
    include: {
      files: true,
    },
  });

  console.log("Users: ", JSON.stringify(getUsers, null, 2));
}

main().then(async () => {
  await prisma.$disconnect();
});
