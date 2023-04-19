-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PouleMatch" (
    "id" SERIAL NOT NULL,
    "pouleId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PouleMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PouleMatchTeam" (
    "id" SERIAL NOT NULL,
    "pouleMatchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PouleMatchTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BracketMatch" (
    "id" SERIAL NOT NULL,
    "league" TEXT NOT NULL,
    "parentId" INTEGER,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BracketMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BracketMatchTeam" (
    "id" SERIAL NOT NULL,
    "bracketMatchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BracketMatchTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PouleMatchTeam_teamId_pouleMatchId_key" ON "PouleMatchTeam"("teamId", "pouleMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "BracketMatchTeam_teamId_bracketMatchId_key" ON "BracketMatchTeam"("teamId", "bracketMatchId");

-- AddForeignKey
ALTER TABLE "PouleMatch" ADD CONSTRAINT "PouleMatch_pouleId_fkey" FOREIGN KEY ("pouleId") REFERENCES "Poule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PouleMatchTeam" ADD CONSTRAINT "PouleMatchTeam_pouleMatchId_fkey" FOREIGN KEY ("pouleMatchId") REFERENCES "PouleMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PouleMatchTeam" ADD CONSTRAINT "PouleMatchTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BracketMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatchTeam" ADD CONSTRAINT "BracketMatchTeam_bracketMatchId_fkey" FOREIGN KEY ("bracketMatchId") REFERENCES "BracketMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatchTeam" ADD CONSTRAINT "BracketMatchTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
