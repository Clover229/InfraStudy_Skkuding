import fs from "fs";
import express from "express";
import os from "os";
import { getAllRestaurants, getRestaurantByName, addRestaurant, deleteRestaurant, updateRestaurant, } from "./services/restaurantService.js";
const app = express();
app.use(express.json());
//전체맛집목록 반환
app.get("/restaurants", (req, res) => {
    const { name } = req.query;
    if (name) {
        console.log("req.query:", req.query);
        console.log("req.query.name:", req.query.name);
        const restaurant = getRestaurantByName(name);
        if (restaurant) {
            res.json(restaurant);
        }
        else {
            // 데이터에 없는 이름일 때
            res.status(404).json({
                message: `해당 맛집 정보가 존재하지 않습니다: ${name}`,
            });
        }
    }
    else {
        const restaurants = getAllRestaurants();
        res.json(restaurants);
    }
});
app.post("/restaurant", (req, res) => {
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }
    const newRestaurant = { name, address, phone };
    const addedRestaurant = addRestaurant(newRestaurant);
    if (addedRestaurant) {
        res.status(201).json(addedRestaurant);
    }
    else {
        res.status(409).json({ error: "이미 해당 맛집 정보가 존재합니다." });
    }
});
app.delete("/restaurant", (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: "맛집 이름을 입력해주세요." });
    }
    try {
        const deletedRestaurant = deleteRestaurant(name);
        res.json(deletedRestaurant);
    }
    catch (error) {
        if (error.message.startsWith("RestaurantNotFound")) {
            res
                .status(404)
                .json({ message: `해당 맛집 정보가 존재하지 않습니다: ${name}` });
        }
        else {
            console.error("Error deleting restaurant:", error);
            res.status(500).json({ message: "서버 오류" });
        }
    }
});
app.patch("/restaurant", (req, res) => {
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
        return res
            .status(400)
            .json({ message: "모든 필드의 이름을 작성해주세요." });
    }
    try {
        const updatedRestaurant = { name, address, phone };
        const result = updateRestaurant(updatedRestaurant);
        res.json(result);
    }
    catch (error) {
        if (error.message.startsWith("RestaurantNotFound")) {
            res
                .status(404)
                .json({ message: `해당 맛집 정보가 존재하지 않습니다: ${name}` });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "서버 오류" });
        }
    }
});
app.listen(3000, () => {
    console.log("서버 실행중.... http://localhost:3000");
});
//# sourceMappingURL=server.js.map
//# sourceMappingURL=server.js.map
//# sourceMappingURL=server.js.map