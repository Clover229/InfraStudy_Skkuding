import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "../../data/restaurants.json");

export interface Restaurant {
  name: string;
  address: string;
  phone: string;
}
export function getAllRestaurants(): Restaurant[] {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(data);
    const restaurants = Array.isArray(parsed) ? parsed : parsed.restaurants;
    return restaurants;
  } catch (err) {
    console.error("Error reading restaurants data:", err);
    return [];
  }
}
//배열을 넘겨주어야 한다. find 함수가 효율적이기 때문.
//특정 레스토랑을 이름으로 검색, 쿼리 파라미터로 받음
export function getRestaurantByName(name: string): Restaurant | null {
  const restaurants = getAllRestaurants();
  const restaurant = restaurants.find((r) => r.name === name);
  return restaurant ?? null;
}
//post로 맛집생성
export function addRestaurant(newRestaurant: Restaurant): Restaurant | null {
  const restaurants = getAllRestaurants();
  const isDuplicate = restaurants.some((r) => r.name === newRestaurant.name);
  if (isDuplicate) {
    console.error("Duplicate restaurant name:", newRestaurant.name);
    return null;
  }
  restaurants.push(newRestaurant);
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(restaurants, null, 2),
      "utf8"
    );
    return newRestaurant;
  } catch (err) {
    console.error("Error writing restaurants data:", err);
    return null;
  }
}
//delete
export function deleteRestaurant(name: string): Restaurant {
  // 반환 타입을 Restaurant으로 변경
  const restaurants = getAllRestaurants();
  const index = restaurants.findIndex((r) => r.name === name);

  // 1. 식당을 찾을 수 없는 경우: 특정 에러를 throw
  if (index === -1) {
    // Error 객체를 사용하여 에러 종류를 구분할 수 있도록 메시지 지정
    throw new Error(`RestaurantNotFound: "${name}"`);
  }

  const [deletedRestaurant] = restaurants.splice(index, 1) as [Restaurant];

  try {
    // 2. 파일 쓰기 실패: try...catch에서 에러를 throw
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(restaurants, null, 2),
      "utf8"
    );
    // 성공 시 삭제된 객체를 반환 (null 반환 제거)
    return deletedRestaurant;
  } catch (err) {
    // 파일 시스템 쓰기 오류 발생 시 에러를 다시 throw
    // 서버가 500 에러를 반환해야 하므로 일반 Error로 처리
    console.error("Error writing restaurants data:", err);
    throw new Error(`DataWriteFailure: Could not save data after deletion.`);
  }
}
//patch
export function updateRestaurant(updatedRestaurant: Restaurant): Restaurant {
  const restaurants = getAllRestaurants();
  const idx = restaurants.findIndex((r) => r.name === updatedRestaurant.name);
  if (idx == -1) {
    throw new Error(`RestaurantNotFound: "${updatedRestaurant.name}"`);
  }
  const restaurant = restaurants[idx] as Restaurant;
  restaurants[idx] = updatedRestaurant;
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(restaurants, null, 2),
      "utf8"
    );
    return restaurants[idx];
  } catch (err) {
    console.error("Error writing restaurants data:", err);
    throw new Error(`DataWriteFailure: Could not save data after update.`);
  }
}
