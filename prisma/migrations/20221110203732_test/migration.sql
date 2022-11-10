-- CreateTable
CREATE TABLE "UserToken" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("token")
);
