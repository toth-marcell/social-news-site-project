import { faker } from "@faker-js/faker";
import { User } from "./models.js";
import { HashPassword } from "./auth.js";
import "./defaultAdmin.js";

for (let i = 0; i < faker.number.int(5, 20); i++) {
  const name = faker.internet.username();
  const user = await User.create({
    name,
    password: HashPassword(name),
    about: faker.person.bio(),
  });
  for (let j = 0; j < faker.number.int(2, 5); j++) {
    let post;
    if (faker.datatype.boolean()) {
      post = await user.createPost({
        title: faker.word.adjective() + " " + faker.word.noun(),
        link: faker.internet.url(),
        linkType: faker.helpers.arrayElement(["image", "website", "pdf"]),
        category: faker.book.genre(),
      });
    } else {
      post = await user.createPost({
        title: faker.book.title(),
        text: faker.lorem.paragraphs(2),
        category: faker.book.genre(),
      });
    }
    user.createComment({ PostId: post.id, text: "haha" });
  }
}
