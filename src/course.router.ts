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
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.post(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse); // No need for updateAccessToken here
courseRouter.get("/get-courses", getAllCourses); // No need for updateAccessToken here
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.post("/add-question", isAuthenticated, addQuestion);
courseRouter.post("/add-answer", isAuthenticated, addAnswer);
courseRouter.post("/add-review/:id", isAuthenticated, addReview);
courseRouter.post(
  "/add-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.get(
  "/get-admin-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCoursess
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

courseRouter.post(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
