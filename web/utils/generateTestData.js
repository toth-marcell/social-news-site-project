import { faker } from "@faker-js/faker";
import { HashPassword } from "../models/auth.js";
import { CommentVote, PostVote, User } from "../models/models.js";
import "./defaultAdmin.js";

const userPromises = [];
for (let i = 0; i < faker.number.int({ min: 100, max: 200 }); i++) {
  userPromises.push(
    (async () => {
      const name = faker.internet.username();
      const user = await User.create({
        name,
        password: HashPassword(name),
        email: faker.internet.email(),
        about: faker.person.bio(),
      });
      const postPromises = [];
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        postPromises.push(
          (async () => {
            let post;
            if (faker.datatype.boolean()) {
              post = await user.createPost({
                title: faker.word.adjective() + " " + faker.word.noun(),
                link: faker.internet.url(),
                linkType: faker.helpers.arrayElement([
                  "image",
                  "website",
                  "pdf",
                ]),
                category: faker.helpers.arrayElement([
                  "Politics",
                  "Crime",
                  "Economy",
                  "Health",
                  "Sports",
                  "Entertainment",
                  "Weather",
                ]),
              });
            } else {
              post = await user.createPost({
                title: faker.book.title(),
                text: faker.lorem.paragraphs(2),
                category: faker.book.genre(),
              });
            }
            PostVote.create({ UserId: user.id, PostId: post.id });
            const comment = await user.createComment({
              PostId: post.id,
              text: "haha",
            });
            CommentVote.create({ UserId: user.id, CommentId: comment.id });
          })()
        );
      }
      await Promise.allSettled(postPromises);
    })()
  );
}
await Promise.allSettled(userPromises);
