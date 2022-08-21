-- DropForeignKey
ALTER TABLE "JobPostsOnEmployeeProfiles" DROP CONSTRAINT "JobPostsOnEmployeeProfiles_jobPostId_fkey";

-- AddForeignKey
ALTER TABLE "JobPostsOnEmployeeProfiles" ADD CONSTRAINT "JobPostsOnEmployeeProfiles_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
