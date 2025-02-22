import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AuthenticatedUser = {
  email: string;
  id: string;
  role: "RIDER" | "DRIVER" | "ADMIN";
};

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateAndAuthorize = (
  roles?: Array<"RIDER" | "DRIVER" | "ADMIN">
): ((req: AuthRequest, res: Response, next: NextFunction) => void) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      // const decodedVariable = jwt.decode()
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = decoded as AuthenticatedUser;

      if (roles && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden. You do not have permission." });
      }

      next();
    } catch (error: any) {
      console.log(error);
      res.status(401).json({ message: "Invalid token.", error: error.message });
    }
  };
};
