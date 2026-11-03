import * as fs from "fs";

interface Building {
  address: string;
  nextId: string | null;
}

function findLongestRoute(inputFile: string, outputFile: string): void {
  const content = fs.readFileSync(inputFile, "utf-8");

  const buildings = new Map<string, Building>();
  const nextIds = new Set<string>();

  // 1. Читаем здания из файла
  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const [id, address, nextId] = line.split(";").map((s) => s.trim());

    if (!id || !address) {
      console.error("Нет Id или address");
    } else {
      buildings.set(id, {
        address,
        nextId: nextId || null,
      });
    }

    if (nextId) {
      nextIds.add(nextId);
    }
  }

  // 2. Находим начала маршрутов
  // Это здания, на которые никто не ссылается
  const starts = [...buildings.keys()].filter((id) => !nextIds.has(id));

  let longestRoute: string[] = [];

  // 3. Проходим по каждому маршруту
  for (const startId of starts) {
    const route: string[] = [];
    let currentId: string | null = startId;

    while (currentId !== null) {
      const building: Building | undefined = buildings.get(currentId);

      if (!building) break;

      route.push(building.address);
      currentId = building.nextId;
    }

    // 4. Сохраняем самый длинный маршрут
    if (route.length > longestRoute.length) {
      longestRoute = route;
    }
  }

  // 5. Записываем результат в файл
  fs.writeFileSync(outputFile, longestRoute.join(" -> "), "utf-8");
}

findLongestRoute("input.txt", "output.txt");
