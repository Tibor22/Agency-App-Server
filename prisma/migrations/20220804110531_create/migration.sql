-- CreateTable
CREATE TABLE "JobPostsOnEmployeeProfiles" (
    "jobPostId" INTEGER NOT NULL,
    "employeeProfileId" INTEGER NOT NULL,

    CONSTRAINT "JobPostsOnEmployeeProfiles_pkey" PRIMARY KEY ("jobPostId","employeeProfileId")
);

-- AddForeignKey
ALTER TABLE "JobPostsOnEmployeeProfiles" ADD CONSTRAINT "JobPostsOnEmployeeProfiles_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPostsOnEmployeeProfiles" ADD CONSTRAINT "JobPostsOnEmployeeProfiles_employeeProfileId_fkey" FOREIGN KEY ("employeeProfileId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
