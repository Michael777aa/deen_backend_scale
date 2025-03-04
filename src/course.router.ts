import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getAdminAllCoursess,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "./controllers/course.controller";
import { isAuthenticated } from "./libs/utils/auth";
import {
  authorizeRoles,
  updateAccessToken,
} from "./controllers/member.controller";

const courseRouter = express.Router();

/** Course **/

// Course Routes
courseRouter.post(
  "/create-course",
  updateAccessToken, // Add to refresh the access token if expired
  uploadCourse
);

courseRouter.post("/edit-course/:id", updateAccessToken, editCourse);

courseRouter.get("/get-course/:id", getSingleCourse); // No need for updateAccessToken here
courseRouter.get("/get-courses", getAllCourses); // No need for updateAccessToken here
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.post("/add-question", addQuestion);
courseRouter.post("/add-answer", addAnswer);
courseRouter.post("/add-review/:id", addReview);
courseRouter.post("/add-reply", addReplyToReview);

courseRouter.get("/get-admin-courses", getAdminAllCoursess);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

courseRouter.post("/delete-course/:id", deleteCourse);

export default courseRouter;
