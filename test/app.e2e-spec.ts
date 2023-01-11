import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common/pipes";
import { PrismaService } from "../src/prisma/prisma.service";

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

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("SignUp", () => {
      it.todo("should signup");
    });

    describe("SignIn", () => {});
  });

  describe("User", () => {
    describe("Get current user", () => {});

    describe("Edit User", () => {});
  });

  describe("Bookmark", () => {
    describe("Create Bookmark", () => {});
    describe("Get Bookmarks", () => {});

    describe("Get Bookmark by Id", () => {});

    describe("Edit Bookmark", () => {});

    describe("Delete bookmark", () => {});
  });
});
