import { ApiError } from "../utils/apiError";

export const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }
        if (user.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }
        next();
    } catch (error) {
        return next(error);
    }
});