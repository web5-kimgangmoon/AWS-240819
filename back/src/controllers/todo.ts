import { Router, Request, Response } from "express";
import { add, deleteTodo, show, updateTodo } from "../services/todo";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  try {
    const todo = add(req.body.title);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ errorMessage: error });
  }
});

router.get("/", (req: Request, res: Response) => {
  try {
    const todo = show();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ errorMessage: error });
  }
});

router.delete("/", (req: Request, res: Response) => {
  try {
    const todo = deleteTodo(+req.body.id);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ errorMessage: error });
  }
});

router.patch("/", (req: Request, res: Response) => {
  try {
    const todo = updateTodo(+req.body.id);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ errorMessage: error });
  }
});

export default router;
