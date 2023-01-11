import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common/pipes";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
    pactum.request.setBaseUrl("http://localhost:4000");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "Karol@gmail.com",
      password: "123",
    };
    describe("SignUp", () => {
      it("should throw if bad input", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it("should throw no input provided", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it("should signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
      it("should throw if user email taken", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe("SignIn", () => {
      it("should throw if bad input", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it("should throw no input provided", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({ pasword: dto.email })
          .expectStatus(400);
      });
      it("should signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAt", "access_token");
      });
    });
  });
  describe("User", () => {
    describe("Get me", () => {
      it("should get current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200);
      });
    });

    describe("Edit user", () => {
      it("should edit user", () => {
        const dto: EditUserDto = {
          firstName: "Karol",
          email: "Karol@gmail.com",
        };
        return pactum
          .spec()
          .patch("/users")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe("Bookmarks", () => {
    describe("Get empty bookmarks", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe("Create bookmark", () => {
      const dto: CreateBookmarkDto = {
        title: "First Bookmark",
        link: "https://www.youtube.com/watch?v=d6WC5n9G_sM",
      };
      it("should create bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(201)
          .stores("bookmarkId", "id");
      });
    });

    describe("Get bookmarks", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe("Get bookmark by id", () => {
      it("should get bookmark by id", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("$S{bookmarkId}");
      });
    });

    describe("Edit bookmark by id", () => {
      const dto: EditBookmarkDto = {
        title:
          "Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)",
        description:
          "Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.",
      };
      it("should edit bookmark", () => {
        return pactum
          .spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe("Delete bookmark by id", () => {
      it("should delete bookmark", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(204);
      });

      it("should get empty bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
