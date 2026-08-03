"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  lineColors,
  lineStops,
  mentorRentRecords,
  publicRentSnapshots,
  stationCoverage,
  stationKnowledge,
  type MentorRentRecord,
  type StationKnowledge,
} from "./location-data";

type Need = {
  name: string;
  budgetMin: number;
  budgetMax: number;
  workplace: string;
  commute: number;
  metro: string;
  station: string;
  room: string;
  moveIn: string;
};

type HardRequirements = {
  rawText: string;
  rentMode: "不限" | "必须整租" | "可以合租";
  kitchen: "不限" | "必须独立厨房";
  bathroom: "不限" | "必须独立卫生间";
  utilities: "不限" | "必须民水民电";
  pet: "不限" | "必须可养宠";
  elevator: "不限" | "必须有电梯";
  maxMetroWalk: number;
  otherMust: string;
  negotiable: string;
};

type Listing = {
  id: number;
  title: string;
  price: number;
  area: string;
  location: string;
  commute: number;
  metro: string;
  room: string;
  tags: string[];
  image: string;
  status: "可带看" | "待确认" | "已租";
  updated: string;
};

type MapListing = {
  id: string;
  title: string;
  kind: "小区" | "公寓 / 商住";
  station: string;
  lines: string[];
  district: string;
  verification: StationKnowledge["verification"];
  source: string;
  researchedAt: string;
  mentorRecords: MentorRentRecord[];
};

type MatchRecord = {
  id: number;
  client: string;
  createdAt: string;
  listingIds: number[];
};

type View = "intake" | "match" | "knowledge" | "listings" | "records";

const initialNeed: Need = {
  name: "小周",
  budgetMin: 2200,
  budgetMax: 2600,
  workplace: "钱江世纪城",
  commute: 30,
  metro: "2号线",
  station: "钱江世纪城",
  room: "一室 / 合租可选",
  moveIn: "8月初",
};

const initialHardRequirements: HardRequirements = {
  rawText: "",
  rentMode: "不限",
  kitchen: "不限",
  bathroom: "不限",
  utilities: "不限",
  pet: "不限",
  elevator: "不限",
  maxMetroWalk: 0,
  otherMust: "",
  negotiable: "",
};

const sampleListings: Listing[] = [
  {
    id: 1,
    title: "盈一佳苑 · 朝南一室",
    price: 2450,
    area: "盈丰街道",
    location: "距7号线盈丰路站 520m",
    commute: 19,
    metro: "7号线",
    room: "整租一室",
    tags: ["独立厨卫", "民水民电", "8月可入住"],
    image: "./room-1.png",
    status: "可带看",
    updated: "今天 09:40",
  },
  {
    id: 2,
    title: "奥体华悦城 · 精装合租次卧",
    price: 2280,
    area: "钱江世纪城",
    location: "步行到公司约18分钟",
    commute: 18,
    metro: "7号线",
    room: "合租次卧",
    tags: ["带阳台", "室友稳定", "押一付一"],
    image: "./room-2.png",
    status: "可带看",
    updated: "今天 10:12",
  },
  {
    id: 3,
    title: "宁安社区 · 整租一室",
    price: 2580,
    area: "宁围街道",
    location: "距7号线明星路站 680m",
    commute: 26,
    metro: "7号线",
    room: "整租一室",
    tags: ["朝南采光", "可做饭", "随时看房"],
    image: "./room-3.png",
    status: "可带看",
    updated: "昨天 20:36",
  },
  {
    id: 4,
    title: "建设三路 · 青秀公寓",
    price: 2350,
    area: "市北板块",
    location: "距2号线建设三路站 760m",
    commute: 34,
    metro: "2号线",
    room: "整租一室",
    tags: ["电梯房", "独立厨卫", "可养猫"],
    image: "./room-1.png",
    status: "待确认",
    updated: "昨天 16:18",
  },
  {
    id: 5,
    title: "新街 · 花城名苑单间",
    price: 2100,
    area: "新街街道",
    location: "距7号线新街站 930m",
    commute: 39,
    metro: "7号线",
    room: "合租主卧",
    tags: ["朝南", "民水民电", "短租可谈"],
    image: "./room-2.png",
    status: "可带看",
    updated: "7月24日",
  },
];

const demoListingTitles = new Set(sampleListings.map((listing) => listing.title));

const mentorRecordsByProject = mentorRentRecords.reduce<
  Record<string, MentorRentRecord[]>
>((result, record) => {
  const key = `${record.station}::${record.project}`;
  result[key] = [...(result[key] ?? []), record];
  return result;
}, {});

const mapListings: MapListing[] = stationKnowledge.flatMap((entry) => [
  ...entry.communities.map((title, index) => ({
    id: `${entry.id}-community-${index}-${title}`,
    title,
    kind: "小区" as const,
    station: entry.station,
    lines: entry.lines,
    district: entry.district,
    verification: entry.verification,
    source: entry.source,
    researchedAt: entry.researchedAt,
    mentorRecords: mentorRecordsByProject[`${entry.station}::${title}`] ?? [],
  })),
  ...entry.apartments.map((title, index) => ({
    id: `${entry.id}-apartment-${index}-${title}`,
    title,
    kind: "公寓 / 商住" as const,
    station: entry.station,
    lines: entry.lines,
    district: entry.district,
    verification: entry.verification,
    source: entry.source,
    researchedAt: entry.researchedAt,
    mentorRecords: mentorRecordsByProject[`${entry.station}::${title}`] ?? [],
  })),
]);

const stationByName = new Map(
  stationKnowledge.map((entry) => [entry.station, entry]),
);

const emptyListing: Omit<Listing, "id" | "image" | "updated"> = {
  title: "",
  price: 2200,
  area: "",
  location: "",
  commute: 30,
  metro: "7号线",
  room: "整租一室",
  tags: [],
  status: "可带看",
};

function readCell(row: Record<string, unknown>, aliases: string[]) {
  const key = Object.keys(row).find((item) =>
    aliases.some((alias) => item.trim().toLowerCase() === alias.toLowerCase()),
  );
  return key ? row[key] : undefined;
}

function normalizeImportedListings(
  rows: Record<string, unknown>[],
  startId: number,
): Listing[] {
  return rows
    .map((row, index) => {
      const title = String(
        readCell(row, ["房源名称", "小区", "标题", "房源"]) ?? "",
      ).trim();
      const price = Number(readCell(row, ["租金", "价格", "月租"]) ?? 0);
      if (!title || !price) return null;
      const rawTags = String(readCell(row, ["标签", "特点", "卖点"]) ?? "");
      const rawStatus = String(
        readCell(row, ["状态", "房源状态"]) ?? "可带看",
      );
      const status: Listing["status"] = rawStatus.includes("租")
        ? "已租"
        : rawStatus.includes("确认")
          ? "待确认"
          : "可带看";
      const id = startId + index;
      return {
        id,
        title,
        price,
        area: String(readCell(row, ["区域", "板块", "街道"]) ?? "萧山"),
        location: String(
          readCell(row, ["位置", "地铁距离", "地址", "交通"]) ?? "位置待补充",
        ),
        commute: Number(readCell(row, ["通勤", "通勤分钟"]) ?? 30),
        metro: String(readCell(row, ["地铁线", "地铁"]) ?? "不限"),
        room: String(readCell(row, ["户型", "房型"]) ?? "单间"),
        tags: rawTags
          .split(/[、,，/|]/)
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 4),
        image: `./room-${(id % 3) + 1}.png`,
        status,
        updated: "刚刚",
      } satisfies Listing;
    })
    .filter((listing): listing is Listing => Boolean(listing));
}

function getStationDistance(
  line: string,
  fromStation: string,
  toStation: string,
) {
  const stops = lineStops[line] ?? [];
  const fromIndex = stops.indexOf(fromStation);
  const toIndex = stops.indexOf(toStation);
  return fromIndex >= 0 && toIndex >= 0
    ? Math.abs(fromIndex - toIndex)
    : Number.POSITIVE_INFINITY;
}

function parseWalkMeters(location: string) {
  const meters = location.match(/(\d{2,4})\s*m/i);
  if (meters) return Number(meters[1]);
  const kilometers = location.match(/(\d(?:\.\d+)?)\s*公里/);
  return kilometers ? Math.round(Number(kilometers[1]) * 1000) : null;
}

function listingHardFailures(
  listing: Listing,
  need: Need,
  hard: HardRequirements,
) {
  const failures: string[] = [];

  if (listing.price > need.budgetMax) failures.push("超过最高预算");
  if (listing.commute > need.commute) failures.push("超过通勤上限");
  if (need.metro !== "不限" && !listing.metro.includes(need.metro)) {
    failures.push("地铁线路不符");
  }
  if (
    hard.rentMode === "必须整租" &&
    (listing.room.includes("合租") ||
      listing.room.includes("主卧") ||
      listing.room.includes("次卧"))
  ) {
    failures.push("不是整租");
  }
  if (
    hard.kitchen === "必须独立厨房" &&
    !listing.tags.some((tag) => /独立厨|可做饭/.test(tag))
  ) {
    failures.push("独立厨房待确认");
  }
  if (
    hard.bathroom === "必须独立卫生间" &&
    !listing.tags.some((tag) => /独立厨卫|独卫/.test(tag))
  ) {
    failures.push("独立卫生间待确认");
  }
  if (
    hard.utilities === "必须民水民电" &&
    !listing.tags.includes("民水民电")
  ) {
    failures.push("水电性质不符");
  }
  if (
    hard.pet === "必须可养宠" &&
    !listing.tags.some((tag) => /可养|宠物|养猫|养狗/.test(tag))
  ) {
    failures.push("养宠待确认");
  }
  if (
    hard.elevator === "必须有电梯" &&
    !listing.tags.some((tag) => /电梯/.test(tag))
  ) {
    failures.push("电梯待确认");
  }
  if (hard.maxMetroWalk > 0) {
    const walkMeters = parseWalkMeters(listing.location);
    if (walkMeters === null) failures.push("地铁步行距离待确认");
    else if (walkMeters > hard.maxMetroWalk) failures.push("离地铁过远");
  }

  return failures;
}

function parseCustomerRequest(
  rawText: string,
  currentNeed: Need,
  currentHard: HardRequirements,
) {
  const nextNeed = { ...currentNeed };
  const nextHard = { ...currentHard, rawText };

  const budgetRange = rawText.match(
    /(?:预算|租金)?[^\d]{0,5}(\d{3,5})\s*(?:到|至|-|—|~|～)\s*(\d{3,5})/,
  );
  const budgetMax = rawText.match(
    /(?:预算|租金)(?:不超|不超过|最多|最高|控制在|大概|是|为|[:：])?\s*(\d{3,5})/,
  );
  if (budgetRange) {
    nextNeed.budgetMin = Number(budgetRange[1]);
    nextNeed.budgetMax = Number(budgetRange[2]);
  } else if (budgetMax) {
    const max = Number(budgetMax[1]);
    nextNeed.budgetMax = max;
    nextNeed.budgetMin = Math.max(0, max - 600);
  }

  const commute = rawText.match(/(\d{1,2})\s*分钟(?:内|以内|左右)?/);
  if (commute) nextNeed.commute = Number(commute[1]);

  const workplace =
    rawText.match(/在([^，。,\n]{2,16}?)(?:上班|工作)/) ??
    rawText.match(/(?:上班地|工作地点)[:：]?\s*([^，。,\n]{2,16})/);
  if (workplace) nextNeed.workplace = workplace[1].trim();

  const station = Array.from(
    new Set(Object.values(lineStops).flat()),
  ).find((item) => rawText.includes(`${item}站`) || rawText.includes(item));
  const line = rawText.match(/(2|5|7|19)号线/)?.[0];
  if (line) nextNeed.metro = line;
  if (station) {
    nextNeed.station = station;
    if (!line) {
      const inferredLine = Object.entries(lineStops).find(([, stops]) =>
        stops.includes(station),
      )?.[0];
      if (inferredLine) nextNeed.metro = inferredLine;
    }
  }

  if (/一室一厅/.test(rawText)) nextNeed.room = "一室一厅";
  else if (/两室一厅|两室/.test(rawText)) nextNeed.room = "两室一厅";
  else if (/整租一室|一室|独居/.test(rawText)) nextNeed.room = "整租一室";
  else if (/主卧/.test(rawText)) nextNeed.room = "合租主卧";
  else if (/次卧|单间/.test(rawText)) nextNeed.room = "合租次卧";

  const moveIn = rawText.match(
    /(?:随时入住|随时|拎包入住|\d{1,2}月(?:初|中|底|上旬|中旬|下旬|\d{1,2}号)?)/,
  );
  if (moveIn) nextNeed.moveIn = moveIn[0];

  if (/整租|独居|一个人住/.test(rawText)) nextHard.rentMode = "必须整租";
  else if (/合租/.test(rawText)) nextHard.rentMode = "可以合租";
  if (/独立厨房|独立厨卫|必须做饭|可做饭/.test(rawText)) {
    nextHard.kitchen = "必须独立厨房";
  }
  if (/独卫|独立卫生间|独立厨卫/.test(rawText)) {
    nextHard.bathroom = "必须独立卫生间";
  }
  if (/民水民电/.test(rawText)) nextHard.utilities = "必须民水民电";
  if (/养猫|养狗|宠物|可养/.test(rawText)) nextHard.pet = "必须可养宠";
  if (/电梯/.test(rawText)) nextHard.elevator = "必须有电梯";

  const walkMeters =
    rawText.match(/(?:地铁|步行|距离)[^\d]{0,8}(\d{2,4})\s*米/) ??
    rawText.match(/(\d{2,4})\s*米[^\n，。]{0,8}(?:地铁|步行)/);
  const walkKilometers = rawText.match(
    /(?:地铁|步行|距离)[^\d]{0,8}(\d(?:\.\d+)?)\s*公里/,
  );
  if (walkMeters) nextHard.maxMetroWalk = Number(walkMeters[1]);
  else if (walkKilometers) {
    nextHard.maxMetroWalk = Math.round(Number(walkKilometers[1]) * 1000);
  }

  return { nextNeed, nextHard };
}

function analyzeRequirements(
  need: Need,
  hard: HardRequirements,
  listings: Listing[],
) {
  const requiredChecks = [
    Boolean(need.name.trim()),
    Boolean(need.workplace.trim()),
    need.budgetMax > 0,
    need.commute > 0,
    Boolean(need.metro),
    Boolean(need.station),
    Boolean(need.room),
    Boolean(need.moveIn.trim()),
  ];
  const completeness = Math.round(
    (requiredChecks.filter(Boolean).length / requiredChecks.length) * 100,
  );
  const missing: string[] = [];
  if (!need.name.trim()) missing.push("客户称呼");
  if (!need.workplace.trim()) missing.push("上班地点");
  if (!need.budgetMax) missing.push("最高预算");
  if (!need.commute) missing.push("通勤上限");
  if (!need.station) missing.push("目标站或可接受沿线");
  if (!need.room) missing.push("整租 / 合租与房型");
  if (!need.moveIn.trim()) missing.push("入住时间");

  const hardTags = [
    `预算≤¥${need.budgetMax}`,
    `${need.workplace}上班`,
    `通勤≤${need.commute}分钟`,
    need.metro === "不限" ? "地铁不限" : `${need.metro}·${need.station}站`,
    need.room,
    need.moveIn,
    hard.rentMode !== "不限" ? hard.rentMode : "",
    hard.kitchen !== "不限" ? "独立厨房" : "",
    hard.bathroom !== "不限" ? "独立卫生间" : "",
    hard.utilities !== "不限" ? "民水民电" : "",
    hard.pet !== "不限" ? "可养宠" : "",
    hard.elevator !== "不限" ? "有电梯" : "",
    hard.maxMetroWalk > 0 ? `地铁步行≤${hard.maxMetroWalk}米` : "",
    ...hard.otherMust
      .split(/[、,，/|]/)
      .map((item) => item.trim())
      .filter(Boolean),
  ].filter(Boolean);

  const liveCompatible = listings.filter(
    (listing) =>
      listing.status !== "已租" &&
      listingHardFailures(listing, need, hard).length === 0,
  );
  const nearbyMapCandidates = mapListings.filter((listing) => {
    if (need.metro !== "不限" && !listing.lines.includes(need.metro)) {
      return false;
    }
    if (!need.station || need.metro === "不限") return true;
    return listing.lines.some(
      (line) => getStationDistance(line, need.station, listing.station) <= 2,
    );
  });

  const conflicts: string[] = [];
  const coreStations = ["钱江世纪城", "飞虹路", "盈丰路", "市民中心"];
  const highSpec =
    hard.rentMode === "必须整租" ||
    hard.kitchen === "必须独立厨房" ||
    hard.bathroom === "必须独立卫生间";
  if (need.budgetMax <= 1500 && highSpec) {
    conflicts.push("预算≤1500元同时要求整租或独立厨卫，选择面会非常窄。");
  }
  if (
    need.budgetMax <= 2000 &&
    coreStations.includes(need.station) &&
    highSpec
  ) {
    conflicts.push("核心站点、低预算和独立空间同时锁死，建议先确认哪一项能放宽。");
  }
  if (
    hard.maxMetroWalk > 0 &&
    hard.maxMetroWalk <= 500 &&
    hardTags.length >= 7
  ) {
    conflicts.push("步行≤500米叠加多项硬条件，容易出现“位置有、房型没有”的情况。");
  }
  const stationPrice = stationByName.get(need.station)?.price;
  if (stationPrice && stationPrice.min > need.budgetMax) {
    conflicts.push(
      `${need.station}站师傅参考价约¥${stationPrice.min}起，高于客户最高预算。`,
    );
  }
  if (liveCompatible.length === 0) {
    conflicts.push("当前现房库没有一套已确认同时满足全部硬条件。");
  }

  const strategies = [
    `先查${need.station || "目标站"}及同线相邻2站，共有${nearbyMapCandidates.length}条地图候选关系。`,
    liveCompatible.length > 0
      ? `现房库有${liveCompatible.length}套通过全部硬条件，可优先确认在租与带看时间。`
      : "先按小区名单向房东群问房，未核实独卫、水电等条件前不要对客户承诺。",
    hard.negotiable.trim()
      ? `客户已说明可商量：${hard.negotiable.trim()}。`
      : "若无房，建议依次询问：地铁步行距离 → 相邻站 → 装修 → 房型；预算最后再谈。",
  ];

  const status =
    missing.length >= 2
      ? "信息不完整"
      : conflicts.length >= 2
        ? "条件冲突"
        : liveCompatible.length > 0
          ? "可直接配"
          : "条件偏紧";

  return {
    completeness,
    missing,
    hardTags,
    conflicts,
    strategies,
    status,
    liveCompatibleCount: liveCompatible.length,
    nearbyMapCandidateCount: nearbyMapCandidates.length,
  };
}

function scoreListing(
  listing: Listing,
  need: Need,
  hard: HardRequirements,
) {
  let score = 0;
  const reasons: string[] = [];
  const hardFailures = listingHardFailures(listing, need, hard);

  if (listing.price >= need.budgetMin && listing.price <= need.budgetMax) {
    score += 35;
    reasons.push("预算内");
  } else {
    const gap =
      listing.price < need.budgetMin
        ? need.budgetMin - listing.price
        : listing.price - need.budgetMax;
    score += Math.max(0, 35 - Math.ceil(gap / 50) * 4);
  }

  if (listing.commute <= need.commute) {
    score += 25;
    reasons.push(`通勤${listing.commute}分钟`);
  } else {
    score += Math.max(0, 25 - (listing.commute - need.commute) * 3);
  }

  if (listing.metro.includes(need.metro) || need.metro === "不限") {
    score += 20;
    reasons.push(need.metro === "不限" ? "地铁可达" : `${need.metro}沿线`);
  }

  if (
    need.room.includes("可选") ||
    listing.room.includes(need.room.replace("整租", "").trim())
  ) {
    score += 10;
  } else if (
    need.room.includes("一室") &&
    (listing.room.includes("一室") || listing.room.includes("主卧"))
  ) {
    score += 8;
  }

  if (listing.tags.includes("民水民电")) score += 5;
  if (listing.status === "可带看") score += 5;

  if (hardFailures.length === 0) {
    score += 8;
    reasons.push("硬需求通过");
  } else {
    score -= Math.min(30, hardFailures.length * 8);
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    hardFailures,
  };
}

function scoreStation(entry: StationKnowledge, need: Need) {
  let score = 0;
  const reasons: string[] = [];

  if (need.metro === "不限" || entry.lines.includes(need.metro)) {
    score += 34;
    reasons.push(need.metro === "不限" ? "地铁可选" : `${need.metro}沿线`);
  }

  if (entry.station === need.station) {
    score += 28;
    reasons.push("目标站");
  } else {
    const distances = entry.lines
      .map((line) => {
        const stops = lineStops[line] ?? [];
        const targetIndex = stops.indexOf(need.station);
        const entryIndex = stops.indexOf(entry.station);
        return targetIndex >= 0 && entryIndex >= 0
          ? Math.abs(targetIndex - entryIndex)
          : Number.POSITIVE_INFINITY;
      })
      .filter(Number.isFinite);
    const distance = distances.length > 0 ? Math.min(...distances) : null;
    if (distance === 1) {
      score += 22;
      reasons.push("相邻1站");
    } else if (distance === 2) {
      score += 14;
      reasons.push("相邻2站");
    }
  }

  if (entry.price) {
    const overlaps =
      entry.price.min <= need.budgetMax && entry.price.max >= need.budgetMin;
    if (overlaps) {
      score += 30;
      reasons.push("预算有交集");
    } else {
      const gap =
        entry.price.min > need.budgetMax
          ? entry.price.min - need.budgetMax
          : need.budgetMin - entry.price.max;
      score += Math.max(0, 24 - Math.ceil(gap / 100) * 4);
    }
  } else {
    score += 8;
    reasons.push("价格待补");
  }

  if (
    need.workplace.includes(entry.station) ||
    entry.station.includes(need.workplace)
  ) {
    score += 8;
    reasons.push("上班地匹配");
  }

  return { entry, score: Math.min(100, score), reasons };
}

function scoreMapListing(listing: MapListing, need: Need) {
  const entry = stationByName.get(listing.station);
  if (!entry) return { listing, score: 0, reasons: ["站点待核对"] };
  const stationScore = scoreStation(entry, need);
  const typeReason =
    listing.kind === "公寓 / 商住" ? "公寓候选" : "小区候选";
  const mentorMin =
    listing.mentorRecords.length > 0
      ? Math.min(...listing.mentorRecords.map((record) => record.min))
      : null;
  const mentorMax =
    listing.mentorRecords.length > 0
      ? Math.max(...listing.mentorRecords.map((record) => record.max))
      : null;
  let mentorScore = 0;
  const reasons = [...stationScore.reasons, typeReason];
  if (mentorMin !== null && mentorMax !== null) {
    const overlaps = mentorMin <= need.budgetMax && mentorMax >= need.budgetMin;
    if (overlaps) {
      mentorScore = 18;
      reasons.push("师傅价符合预算");
    } else {
      const gap =
        mentorMin > need.budgetMax
          ? mentorMin - need.budgetMax
          : need.budgetMin - mentorMax;
      mentorScore = Math.max(-12, 12 - Math.ceil(gap / 100) * 3);
      reasons.push("师傅价需调整预算");
    }
  }
  return {
    listing,
    score: Math.max(0, Math.min(100, stationScore.score + mentorScore)),
    reasons,
  };
}

function formatKnowledgePrice(
  entry: StationKnowledge,
  mentorRecords: MentorRentRecord[] = [],
) {
  if (mentorRecords.length > 0) {
    const min = Math.min(...mentorRecords.map((record) => record.min));
    const max = Math.max(...mentorRecords.map((record) => record.max));
    return `¥${min}–${max}`;
  }
  return entry.price ? `¥${entry.price.min}–${entry.price.max}` : "价格待补";
}

function buildMapSearchUrl(station: string) {
  const query = encodeURIComponent(`杭州地铁${station}站 小区 公寓`);
  return `https://www.amap.com/search?query=${query}&city=330100`;
}

function buildBeikeSearchUrl(station: string) {
  return `https://hz.zu.ke.com/zufang/rs${encodeURIComponent(`${station}站`)}/`;
}

function buildAnjukeSearchUrl(station: string) {
  return `https://hz.zu.anjuke.com/fangyuan/?kw=${encodeURIComponent(`${station}站`)}`;
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="need-field">
      <span>{label}</span>
      {children ?? <strong>{value}</strong>}
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("intake");
  const [need, setNeed] = useState(initialNeed);
  const [draft, setDraft] = useState(initialNeed);
  const [intakeNeed, setIntakeNeed] = useState(initialNeed);
  const [hardRequirements, setHardRequirements] = useState(
    initialHardRequirements,
  );
  const [hardDraft, setHardDraft] = useState(initialHardRequirements);
  const [editing, setEditing] = useState(false);
  const [listings, setListings] = useState<Listing[]>(sampleListings);
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [sortMode, setSortMode] = useState<"score" | "price" | "commute">(
    "score",
  );
  const [shortlist, setShortlist] = useState<number[]>([]);
  const [matching, setMatching] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [listingDraft, setListingDraft] = useState(emptyListing);
  const [tagDraft, setTagDraft] = useState("");
  const [toast, setToast] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [knowledgeLine, setKnowledgeLine] = useState("全部");
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [knowledgeLimit, setKnowledgeLimit] = useState(18);
  const [libraryMode, setLibraryMode] = useState<"map" | "live">("map");
  const [mapListingLine, setMapListingLine] = useState("全部");
  const [mapListingQuery, setMapListingQuery] = useState("");
  const [mapListingLimit, setMapListingLimit] = useState(40);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedListings = window.localStorage.getItem("ajie-listings");
        const savedNeed = window.localStorage.getItem("ajie-need");
        const savedShortlist = window.localStorage.getItem("ajie-shortlist");
        const savedRecords = window.localStorage.getItem("ajie-records");
        const savedHardRequirements = window.localStorage.getItem(
          "ajie-hard-requirements",
        );
        if (savedListings) setListings(JSON.parse(savedListings));
        if (savedNeed) {
          const nextNeed = {
            ...initialNeed,
            ...JSON.parse(savedNeed),
          };
          setNeed(nextNeed);
          setDraft(nextNeed);
          setIntakeNeed(nextNeed);
        }
        if (savedHardRequirements) {
          const nextHard = {
            ...initialHardRequirements,
            ...JSON.parse(savedHardRequirements),
          };
          setHardRequirements(nextHard);
          setHardDraft(nextHard);
        }
        if (savedShortlist) setShortlist(JSON.parse(savedShortlist));
        if (savedRecords) setRecords(JSON.parse(savedRecords));
      } catch {
        setToast("本地数据读取失败，已使用示例数据");
      } finally {
        setLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem("ajie-listings", JSON.stringify(listings));
    window.localStorage.setItem("ajie-need", JSON.stringify(need));
    window.localStorage.setItem("ajie-shortlist", JSON.stringify(shortlist));
    window.localStorage.setItem("ajie-records", JSON.stringify(records));
    window.localStorage.setItem(
      "ajie-hard-requirements",
      JSON.stringify(hardRequirements),
    );
  }, [
    listings,
    need,
    shortlist,
    records,
    hardRequirements,
    loaded,
  ]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const matches = useMemo(() => {
    const next = listings
      .filter((listing) => listing.status !== "已租")
      .map((listing) => ({
        listing,
        ...scoreListing(listing, need, hardRequirements),
      }));
    return next.sort((a, b) => {
      if (a.hardFailures.length !== b.hardFailures.length) {
        return a.hardFailures.length - b.hardFailures.length;
      }
      if (sortMode === "price") return a.listing.price - b.listing.price;
      if (sortMode === "commute")
        return a.listing.commute - b.listing.commute;
      return b.score - a.score;
    });
  }, [need, hardRequirements, sortMode, listings]);
  const hardMatchedCount = matches.filter(
    (item) => item.hardFailures.length === 0,
  ).length;

  const stationRecommendations = useMemo(
    () =>
      stationKnowledge
        .map((entry) => scoreStation(entry, need))
        .filter(
          ({ entry }) =>
            need.metro === "不限" || entry.lines.includes(need.metro),
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [need],
  );

  const mapMatches = useMemo(
    () =>
      mapListings
        .map((listing) => scoreMapListing(listing, need))
        .filter(
          ({ listing }) =>
            need.metro === "不限" || listing.lines.includes(need.metro),
        )
        .sort((a, b) => b.score - a.score),
    [need],
  );

  const filteredMapListings = useMemo(() => {
    const query = mapListingQuery.trim().toLowerCase();
    return mapListings.filter((listing) => {
      const lineMatches =
        mapListingLine === "全部" || listing.lines.includes(mapListingLine);
      const queryMatches =
        !query ||
        [
          listing.title,
          listing.station,
          listing.district,
          listing.kind,
          ...listing.lines,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return lineMatches && queryMatches;
    });
  }, [mapListingLine, mapListingQuery]);

  const filteredKnowledge = useMemo(() => {
    const query = knowledgeQuery.trim().toLowerCase();
    return stationKnowledge.filter((entry) => {
      const lineMatches =
        knowledgeLine === "全部" || entry.lines.includes(knowledgeLine);
      if (!lineMatches) return false;
      if (!query) return true;
      return [
        entry.station,
        ...entry.communities,
        ...entry.apartments,
        ...entry.notes,
        ...mentorRentRecords
          .filter((record) => record.station === entry.station)
          .flatMap((record) => [
            record.project,
            record.room,
            ...record.details,
          ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [knowledgeLine, knowledgeQuery]);

  const visibleKnowledge = filteredKnowledge.slice(0, knowledgeLimit);
  const publicSnapshotsByStation = useMemo(
    () =>
      publicRentSnapshots.reduce<Record<string, typeof publicRentSnapshots>>(
        (result, snapshot) => {
          result[snapshot.station] = [
            ...(result[snapshot.station] ?? []),
            snapshot,
          ];
          return result;
        },
        {},
      ),
    [],
  );
  const mentorRecordsByStation = useMemo(
    () =>
      mentorRentRecords.reduce<Record<string, MentorRentRecord[]>>(
        (result, record) => {
          result[record.station] = [
            ...(result[record.station] ?? []),
            record,
          ];
          return result;
        },
        {},
      ),
    [],
  );

  const budgetSamples = listings
    .filter((item) => item.area === matches[0]?.listing.area)
    .map((item) => item.price)
    .sort((a, b) => a - b);
  const referencePrice =
    budgetSamples.length > 0
      ? budgetSamples[Math.floor(budgetSamples.length / 2)]
      : null;

  const intakeAnalysis = useMemo(
    () => analyzeRequirements(intakeNeed, hardDraft, listings),
    [intakeNeed, hardDraft, listings],
  );

  const activeHardTags = useMemo(
    () => analyzeRequirements(need, hardRequirements, listings).hardTags,
    [need, hardRequirements, listings],
  );

  function runMatch() {
    setMatching(true);
    window.setTimeout(() => setMatching(false), 520);
  }

  function saveNeed() {
    setNeed(draft);
    setIntakeNeed(draft);
    setEditing(false);
    runMatch();
  }

  function recognizeCustomerText() {
    if (!hardDraft.rawText.trim()) {
      setToast("先粘贴客户原话，再识别硬需求");
      return;
    }
    const { nextNeed, nextHard } = parseCustomerRequest(
      hardDraft.rawText,
      intakeNeed,
      hardDraft,
    );
    setIntakeNeed(nextNeed);
    setHardDraft(nextHard);
    setToast("已识别客户原话，请检查后应用");
  }

  function applyRequirementAnalysis() {
    setNeed(intakeNeed);
    setDraft(intakeNeed);
    setHardRequirements(hardDraft);
    setActiveView("match");
    runMatch();
    setToast("硬需求已锁定并用于房源匹配");
  }

  function toggleShortlist(id: number) {
    setShortlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function saveMatchRecord() {
    const chosen =
      shortlist.length > 0
        ? shortlist
        : matches.slice(0, 3).map((item) => item.listing.id);
    const record: MatchRecord = {
      id: Date.now(),
      client: need.name,
      createdAt: new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      listingIds: chosen,
    };
    setShortlist(chosen);
    setRecords((current) => [record, ...current].slice(0, 30));
    setToast(`已保存 ${chosen.length} 套房源到匹配记录`);
  }

  function addListing() {
    if (!listingDraft.title.trim() || !listingDraft.area.trim()) {
      setToast("请填写房源名称和区域");
      return;
    }
    const id = Math.max(0, ...listings.map((item) => item.id)) + 1;
    setListings((current) => [
      {
        ...listingDraft,
        id,
        tags: tagDraft
          .split(/[、,，/|]/)
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 4),
        image: `./room-${(id % 3) + 1}.png`,
        updated: "刚刚",
      },
      ...current,
    ]);
    setListingDraft(emptyListing);
    setTagDraft("");
    setShowAddListing(false);
    setToast("房源已加入房源库");
  }

  async function importListings(file: File) {
    try {
      const workbook = XLSX.read(await file.arrayBuffer());
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);
      const startId = Math.max(0, ...listings.map((item) => item.id)) + 1;
      const imported = normalizeImportedListings(rows, startId);
      if (imported.length === 0) {
        setToast("没有识别到有效房源，请使用导入模板");
        return;
      }
      setListings((current) => [...imported, ...current]);
      setToast(`成功导入 ${imported.length} 套房源`);
    } catch {
      setToast("导入失败，请检查表格格式");
    }
  }

  function downloadTemplate() {
    const sheet = XLSX.utils.aoa_to_sheet([
      [
        "房源名称",
        "租金",
        "区域",
        "位置",
        "通勤分钟",
        "地铁线",
        "户型",
        "标签",
        "状态",
      ],
      [
        "示例：盈一佳苑朝南一室",
        2450,
        "盈丰街道",
        "距7号线盈丰路站520m",
        19,
        "7号线",
        "整租一室",
        "独立厨卫、民水民电、8月可入住",
        "可带看",
      ],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "房源导入模板");
    XLSX.writeFile(workbook, "阿杰配房-房源导入模板.xlsx");
  }

  function exportListings() {
    const rows = listings.map((listing) => ({
      房源名称: listing.title,
      租金: listing.price,
      区域: listing.area,
      位置: listing.location,
      通勤分钟: listing.commute,
      地铁线: listing.metro,
      户型: listing.room,
      标签: listing.tags.join("、"),
      状态: listing.status,
      更新时间: listing.updated,
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "房源库");
    XLSX.writeFile(workbook, `阿杰配房-房源库-${Date.now()}.xlsx`);
  }

  function exportMapListings() {
    const rows = mapListings.map((listing) => ({
      房源名称: listing.title,
      类型: listing.kind,
      地铁站: listing.station,
      地铁线: listing.lines.join("、"),
      区域: listing.district,
      租金:
        listing.mentorRecords.length > 0
          ? `${Math.min(...listing.mentorRecords.map((record) => record.min))}-${Math.max(...listing.mentorRecords.map((record) => record.max))}`
          : "",
      房型: listing.mentorRecords.map((record) => record.room).join("；"),
      地铁距离: "",
      水电性质: listing.mentorRecords
        .flatMap((record) => record.details)
        .find((detail) => detail.includes("水") && detail.includes("电")) ?? "",
      额外费用: "",
      房源状态:
        listing.mentorRecords.length > 0 ? "师傅经验库" : "待核价",
      核验状态:
        listing.mentorRecords.length > 0 ? "师傅已核对" : listing.verification,
      来源: listing.source,
      经验备注: listing.mentorRecords
        .flatMap((record) => [...record.details, record.warning ?? ""])
        .filter(Boolean)
        .join("；"),
      调研日期:
        listing.mentorRecords[0]?.observedAt ?? listing.researchedAt,
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "地图待核价房源");
    XLSX.writeFile(workbook, `阿杰配房-地图待核价房源-${Date.now()}.xlsx`);
  }

  function removeDemoListings() {
    const demoIds = listings
      .filter((listing) => demoListingTitles.has(listing.title))
      .map((listing) => listing.id);
    setListings((current) =>
      current.filter((listing) => !demoListingTitles.has(listing.title)),
    );
    setShortlist((current) =>
      current.filter((id) => !demoIds.includes(id)),
    );
    setToast("演示房源已移除，现在可导入你的真实房源");
  }

  async function copyRecord(record: MatchRecord) {
    const selected = record.listingIds
      .map((id) => listings.find((item) => item.id === id))
      .filter((item): item is Listing => Boolean(item));
    const text = [
      `${record.client}，按你的预算和通勤，我先筛了这 ${selected.length} 套：`,
      ...selected.map(
        (listing, index) =>
          `${index + 1}. ${listing.title}｜¥${listing.price}/月｜${listing.location}｜${listing.tags.join("、")}`,
      ),
      "你先看看更偏向哪一套，我再帮你确认当前是否可看。",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setToast("配房清单已复制，可直接发给客户");
    } catch {
      setToast("浏览器未允许复制，请换用安全连接后重试");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">A</div>
          <div>
            <div className="brand-name">阿杰配房</div>
            <div className="brand-subtitle">萧山租房工作台</div>
          </div>
        </div>
        <nav aria-label="主要导航">
          <button
            className={`nav-item ${activeView === "intake" ? "active" : ""}`}
            onClick={() => setActiveView("intake")}
          >
            硬需求分析
          </button>
          <button
            className={`nav-item ${activeView === "match" ? "active" : ""}`}
            onClick={() => setActiveView("match")}
          >
            配房结果
          </button>
          <button
            className={`nav-item ${activeView === "knowledge" ? "active" : ""}`}
            onClick={() => setActiveView("knowledge")}
          >
            沿线知识库
          </button>
          <button
            className={`nav-item ${activeView === "listings" ? "active" : ""}`}
            onClick={() => setActiveView("listings")}
          >
            房源库
          </button>
          <button
            className={`nav-item ${activeView === "records" ? "active" : ""}`}
            onClick={() => setActiveView("records")}
          >
            匹配记录
            {records.length > 0 && (
              <span className="nav-count">{records.length}</span>
            )}
          </button>
        </nav>
        {activeView === "intake" ? (
          <button className="primary-button" onClick={applyRequirementAnalysis}>
            分析并配房
          </button>
        ) : activeView === "match" ? (
          <button className="primary-button" onClick={runMatch}>
            {matching ? "正在匹配…" : "开始配房"}
          </button>
        ) : activeView === "listings" ? (
          <button
            className="primary-button"
            onClick={() => setShowAddListing(true)}
          >
            ＋ 添加房源
          </button>
        ) : activeView === "knowledge" ? (
          <button
            className="primary-button"
            onClick={() => setActiveView("match")}
          >
            用于本次配房
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={() => setActiveView("intake")}
          >
            新建客户分析
          </button>
        )}
      </header>

      {activeView === "intake" && (
        <>
          <section className="page-heading intake-heading">
            <div>
              <p className="eyebrow">先锁硬需求，再开始找房</p>
              <h1>客户硬需求分析</h1>
              <p>
                粘贴客户原话或手动填写，系统会检查信息缺口、条件冲突和可执行配房范围。
              </p>
            </div>
            <div className="heading-stats">
              <div>
                <strong>{intakeAnalysis.completeness}%</strong>
                <span>需求完整度</span>
              </div>
              <div>
                <strong>{intakeAnalysis.nearbyMapCandidateCount}</strong>
                <span>条地图候选</span>
              </div>
            </div>
          </section>

          <section className="intake-workspace">
            <div className="intake-form-panel">
              <div className="intake-section-head">
                <div>
                  <span className="section-kicker">第1步 · 收集原话</span>
                  <h2>把客户说的话放进来</h2>
                </div>
                <button
                  className="secondary-button"
                  onClick={recognizeCustomerText}
                >
                  自动识别硬需求
                </button>
              </div>

              <label className="raw-request">
                客户原话
                <textarea
                  value={hardDraft.rawText}
                  onChange={(event) =>
                    setHardDraft({
                      ...hardDraft,
                      rawText: event.target.value,
                    })
                  }
                  placeholder="例如：我在钱江世纪城上班，预算不超过2000，通勤30分钟内，要整租一室，必须独立厨房和民水民电，最好离地铁800米内，8月初入住。"
                />
              </label>

              <div className="intake-divider">
                <span>第2步 · 核对结构化条件</span>
              </div>

              <div className="intake-fields">
                <label>
                  客户称呼
                  <input
                    value={intakeNeed.name}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        name: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  上班地点
                  <input
                    value={intakeNeed.workplace}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        workplace: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  最低预算
                  <input
                    type="number"
                    value={intakeNeed.budgetMin}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        budgetMin: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  最高预算
                  <input
                    type="number"
                    value={intakeNeed.budgetMax}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        budgetMax: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  通勤上限（分钟）
                  <input
                    type="number"
                    value={intakeNeed.commute}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        commute: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  入住时间
                  <input
                    value={intakeNeed.moveIn}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        moveIn: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  地铁线路
                  <select
                    value={intakeNeed.metro}
                    onChange={(event) => {
                      const metro = event.target.value;
                      setIntakeNeed({
                        ...intakeNeed,
                        metro,
                        station:
                          metro === "不限"
                            ? intakeNeed.station
                            : (lineStops[metro]?.[0] ?? intakeNeed.station),
                      });
                    }}
                  >
                    <option>2号线</option>
                    <option>5号线</option>
                    <option>7号线</option>
                    <option>19号线</option>
                    <option>不限</option>
                  </select>
                </label>
                <label>
                  目标站
                  <select
                    value={intakeNeed.station}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        station: event.target.value,
                      })
                    }
                  >
                    {(intakeNeed.metro === "不限"
                      ? Object.values(lineStops).flat()
                      : (lineStops[intakeNeed.metro] ?? [])
                    )
                      .filter(
                        (station, index, stations) =>
                          stations.indexOf(station) === index,
                      )
                      .map((station) => (
                        <option key={station}>{station}</option>
                      ))}
                  </select>
                </label>
                <label>
                  房型
                  <select
                    value={intakeNeed.room}
                    onChange={(event) =>
                      setIntakeNeed({
                        ...intakeNeed,
                        room: event.target.value,
                      })
                    }
                  >
                    <option>一室 / 合租可选</option>
                    <option>整租一室</option>
                    <option>一室一厅</option>
                    <option>两室一厅</option>
                    <option>合租主卧</option>
                    <option>合租次卧</option>
                  </select>
                </label>
                <label>
                  最远地铁步行
                  <select
                    value={hardDraft.maxMetroWalk}
                    onChange={(event) =>
                      setHardDraft({
                        ...hardDraft,
                        maxMetroWalk: Number(event.target.value),
                      })
                    }
                  >
                    <option value={0}>不限</option>
                    <option value={500}>500米内</option>
                    <option value={800}>800米内</option>
                    <option value={1000}>1公里内</option>
                    <option value={1500}>1.5公里内</option>
                  </select>
                </label>
              </div>

              <div className="hard-option-grid">
                {[
                  ["rentMode", "租住方式", ["不限", "必须整租", "可以合租"]],
                  ["kitchen", "厨房", ["不限", "必须独立厨房"]],
                  ["bathroom", "卫生间", ["不限", "必须独立卫生间"]],
                  ["utilities", "水电", ["不限", "必须民水民电"]],
                  ["pet", "宠物", ["不限", "必须可养宠"]],
                  ["elevator", "楼层", ["不限", "必须有电梯"]],
                ].map(([key, label, options]) => (
                  <label key={key as string}>
                    {label as string}
                    <select
                      value={
                        hardDraft[
                          key as keyof Pick<
                            HardRequirements,
                            | "rentMode"
                            | "kitchen"
                            | "bathroom"
                            | "utilities"
                            | "pet"
                            | "elevator"
                          >
                        ]
                      }
                      onChange={(event) =>
                        setHardDraft({
                          ...hardDraft,
                          [key as string]: event.target.value,
                        })
                      }
                    >
                      {(options as string[]).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="intake-fields wide-fields">
                <label>
                  其他绝不能少
                  <input
                    value={hardDraft.otherMust}
                    onChange={(event) =>
                      setHardDraft({
                        ...hardDraft,
                        otherMust: event.target.value,
                      })
                    }
                    placeholder="例如：朝南、阳台、不能一楼（用顿号分隔）"
                  />
                </label>
                <label>
                  哪些可以商量
                  <input
                    value={hardDraft.negotiable}
                    onChange={(event) =>
                      setHardDraft({
                        ...hardDraft,
                        negotiable: event.target.value,
                      })
                    }
                    placeholder="例如：装修、离地铁距离、相邻站"
                  />
                </label>
              </div>
            </div>

            <aside className="analysis-panel">
              <div className="analysis-hero">
                <span
                  className={`analysis-status status-${intakeAnalysis.status}`}
                >
                  {intakeAnalysis.status}
                </span>
                <strong>{intakeAnalysis.completeness}%</strong>
                <p>需求完整度</p>
              </div>

              <section className="analysis-block">
                <h2>已锁定的硬需求</h2>
                <div className="locked-tags">
                  {intakeAnalysis.hardTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>

              {intakeAnalysis.missing.length > 0 && (
                <section className="analysis-block missing-block">
                  <h2>还要问客户</h2>
                  {intakeAnalysis.missing.map((item) => (
                    <p key={item}>＋ {item}</p>
                  ))}
                </section>
              )}

              <section className="analysis-block conflict-block">
                <h2>冲突与风险</h2>
                {intakeAnalysis.conflicts.length > 0 ? (
                  intakeAnalysis.conflicts.map((item) => (
                    <p key={item}>! {item}</p>
                  ))
                ) : (
                  <p className="analysis-ok">✓ 暂未发现明显条件冲突</p>
                )}
              </section>

              <section className="analysis-block strategy-block">
                <h2>配房执行建议</h2>
                {intakeAnalysis.strategies.map((item, index) => (
                  <div key={item}>
                    <span>{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </section>

              <div className="analysis-counts">
                <div>
                  <strong>{intakeAnalysis.nearbyMapCandidateCount}</strong>
                  <span>地图候选</span>
                </div>
                <div>
                  <strong>{intakeAnalysis.liveCompatibleCount}</strong>
                  <span>现房硬匹配</span>
                </div>
              </div>

              <button
                className="primary-button analysis-apply"
                onClick={applyRequirementAnalysis}
              >
                应用硬需求并开始配房
              </button>
              <small className="analysis-disclaimer">
                地图候选的租金、房型、独卫、水电与当前在租状态仍需逐项核验。
              </small>
            </aside>
          </section>
        </>
      )}

      {activeView === "match" && (
        <>
          <section className="page-heading">
        <div>
          <p className="eyebrow">今天也要给客户找到合适的家</p>
          <h1>萧山配房工作台</h1>
          <p>根据预算、通勤和入住时间，快速筛出最合适的房源。</p>
        </div>
        <div className="heading-stats">
          <div>
            <strong>{mapListings.length}</strong>
            <span>套地图待核价</span>
          </div>
          <div>
            <strong>
              {listings.filter((listing) => listing.status !== "已租").length}
            </strong>
            <span>套现房样本</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="needs-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">当前客户</span>
              <h2>{need.name}</h2>
            </div>
            <span className="status-pill">待配房</span>
          </div>

          {editing ? (
            <div className="edit-form">
              <label>
                客户称呼
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <div className="form-row">
                <label>
                  最低预算
                  <input
                    type="number"
                    value={draft.budgetMin}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        budgetMin: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  最高预算
                  <input
                    type="number"
                    value={draft.budgetMax}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        budgetMax: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <label>
                上班地点
                <input
                  value={draft.workplace}
                  onChange={(event) =>
                    setDraft({ ...draft, workplace: event.target.value })
                  }
                />
              </label>
              <div className="form-row">
                <label>
                  通勤上限
                  <input
                    type="number"
                    value={draft.commute}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        commute: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  地铁
                  <select
                    value={draft.metro}
                    onChange={(event) => {
                      const metro = event.target.value;
                      setDraft({
                        ...draft,
                        metro,
                        station:
                          metro === "不限"
                            ? draft.station
                            : (lineStops[metro]?.[0] ?? draft.station),
                      });
                    }}
                  >
                    <option>2号线</option>
                    <option>5号线</option>
                    <option>7号线</option>
                    <option>19号线</option>
                    <option>不限</option>
                  </select>
                </label>
              </div>
              <label>
                目标地铁站
                <select
                  value={draft.station}
                  onChange={(event) =>
                    setDraft({ ...draft, station: event.target.value })
                  }
                >
                  {(draft.metro === "不限"
                    ? Object.values(lineStops).flat()
                    : (lineStops[draft.metro] ?? [])
                  )
                    .filter(
                      (station, index, stations) =>
                        stations.indexOf(station) === index,
                    )
                    .map((station) => (
                      <option key={station}>{station}</option>
                    ))}
                </select>
              </label>
              <label>
                户型偏好
                <select
                  value={draft.room}
                  onChange={(event) =>
                    setDraft({ ...draft, room: event.target.value })
                  }
                >
                  <option>一室 / 合租可选</option>
                  <option>整租一室</option>
                  <option>合租主卧</option>
                  <option>合租次卧</option>
                </select>
              </label>
              <label>
                入住时间
                <input
                  value={draft.moveIn}
                  onChange={(event) =>
                    setDraft({ ...draft, moveIn: event.target.value })
                  }
                />
              </label>
              <div className="edit-actions">
                <button
                  className="ghost-button"
                  onClick={() => {
                    setDraft(need);
                    setEditing(false);
                  }}
                >
                  取消
                </button>
                <button className="primary-button small" onClick={saveNeed}>
                  保存并匹配
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="needs-list">
                <Field
                  label="预算"
                  value={`${need.budgetMin}–${need.budgetMax} 元/月`}
                />
                <Field label="上班地" value={need.workplace} />
                <Field label="通勤" value={`${need.commute} 分钟内`} />
                <Field label="地铁" value={`${need.metro}优先`} />
                <Field label="目标站" value={need.station} />
                <Field label="户型" value={need.room} />
                <Field label="入住" value={need.moveIn} />
              </div>
              <div className="need-tags">
                <span>近地铁</span>
                <span>民水民电</span>
                <span>可短租优先</span>
              </div>
              <button
                className="secondary-button full"
                onClick={() => {
                  setDraft(need);
                  setEditing(true);
                }}
              >
                编辑客户需求
              </button>
            </>
          )}

          <div className="reference-note">
            <span className="reference-icon">¥</span>
            <div>
              <strong>参考价来自你的房源库</strong>
              <p>
                {referencePrice
                  ? `当前首选区域 ${budgetSamples.length} 套样本，中位数 ¥${referencePrice}/月`
                  : "暂无足够样本"}
                ，随房源库更新，不是平台抓取价。
              </p>
            </div>
          </div>
        </aside>

        <section className="match-panel">
          <div className="match-header">
            <div>
              <span className="section-kicker">智能筛选结果</span>
              <h2>匹配房源</h2>
              <p>
                <strong>{hardMatchedCount}</strong> 套现房通过全部硬需求；
                {hardMatchedCount === 0
                  ? "下方现房为差距最小的备选，不能直接推荐。"
                  : `另有${matches.length - hardMatchedCount}套存在硬条件差距。`}
              </p>
            </div>
            <div className="sort-control">
              <label htmlFor="sort">排序</label>
              <select
                id="sort"
                value={sortMode}
                onChange={(event) =>
                  setSortMode(
                    event.target.value as "score" | "price" | "commute",
                  )
                }
              >
                <option value="score">综合匹配</option>
                <option value="price">租金从低到高</option>
                <option value="commute">通勤从近到远</option>
              </select>
              <button className="save-match-button" onClick={saveMatchRecord}>
                保存清单
              </button>
            </div>
          </div>

          <section className="active-hard-summary" aria-label="当前硬需求">
            <div>
              <span className="section-kicker">当前已锁定</span>
              <div className="locked-tags compact">
                {activeHardTags.slice(0, 9).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <button
              className="text-button"
              onClick={() => {
                setIntakeNeed(need);
                setHardDraft(hardRequirements);
                setActiveView("intake");
              }}
            >
              重新分析硬需求 →
            </button>
          </section>

          <section className="station-advice" aria-label="地图与笔记推荐">
            <div className="station-advice-head">
              <div>
                <span className="section-kicker">地图 × 你的经验</span>
                <h3>先看这几个站</h3>
              </div>
              <button
                className="text-button"
                onClick={() => setActiveView("knowledge")}
              >
                查看沿线知识库 →
              </button>
            </div>
            <div className="station-recommendations">
              {stationRecommendations.map(({ entry, score, reasons }) => (
                <article className="station-recommendation" key={entry.id}>
                  <div className="station-recommendation-top">
                    <div>
                      <div className="line-badges">
                        {entry.lines.map((line) => (
                          <span
                            key={line}
                            style={{
                              backgroundColor: lineColors[line] ?? "#0f8a6a",
                            }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                      <h4>{entry.station}</h4>
                    </div>
                    <strong>{score}<small>分</small></strong>
                  </div>
                  <p>
                    {entry.communities
                      .concat(entry.apartments)
                      .slice(0, 3)
                      .join(" · ") || "楼盘待随真实房源补充"}
                  </p>
                  <div className="station-recommendation-meta">
                    <b>
                      {formatKnowledgePrice(
                        entry,
                        mentorRecordsByStation[entry.station] ?? [],
                      )}
                    </b>
                    <span>{reasons.slice(0, 2).join(" · ")}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="map-match-section" aria-label="地图待核价房源">
            <div className="map-match-head">
              <div>
                <span className="section-kicker">已导入房源库 · 价格待补</span>
                <h3>{need.station}及沿线候选房源</h3>
              </div>
              <button
                className="text-button"
                onClick={() => {
                  setLibraryMode("map");
                  setMapListingQuery(need.station);
                  setActiveView("listings");
                }}
              >
                查看全部地图房源 →
              </button>
            </div>
            <div className="map-match-grid">
              {mapMatches.slice(0, 8).map(({ listing, score, reasons }) => (
                <article className="map-match-card" key={listing.id}>
                  <div>
                    <span className={`project-kind ${listing.kind === "小区" ? "" : "apartment"}`}>
                      {listing.kind}
                    </span>
                    <strong>{score}分</strong>
                  </div>
                  <h4>{listing.title}</h4>
                  <p>
                    {listing.lines.join(" / ")} · {listing.station}站 ·{" "}
                    {listing.district}
                  </p>
                  <footer>
                    <span>{reasons.slice(0, 2).join(" · ")}</span>
                    <b>价格待补</b>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          <div className={`listing-stack ${matching ? "is-matching" : ""}`}>
            {matches
              .slice(0, 4)
              .map(({ listing, score, reasons, hardFailures }, index) => {
              const selected = shortlist.includes(listing.id);
              return (
                <article
                  className="listing-card"
                  key={listing.id}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className="listing-image"
                    style={{ backgroundImage: `url(${listing.image})` }}
                    role="img"
                    aria-label={`${listing.title}房源照片`}
                  >
                    <span className="listing-status">{listing.status}</span>
                  </div>
                  <div className="listing-info">
                    <div className="listing-title-row">
                      <h3>{listing.title}</h3>
                      <span className="update-time">{listing.updated} 更新</span>
                    </div>
                    <p className="location-line">
                      <span>⌖</span>
                      {listing.area} · {listing.location}
                    </p>
                    <div className="listing-tags">
                      {listing.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="reason-line">
                      {reasons.slice(0, 3).map((reason) => (
                        <span key={reason}>✓ {reason}</span>
                      ))}
                    </div>
                    {hardFailures.length > 0 && (
                      <div className="hard-failure-line">
                        {hardFailures.slice(0, 3).map((failure) => (
                          <span key={failure}>! {failure}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="listing-score">
                    <div
                      className="score-ring"
                      style={{
                        background: `conic-gradient(#0f8a6a ${score * 3.6}deg, #e5efeb 0deg)`,
                      }}
                    >
                      <div>
                        <span>匹配</span>
                        <strong>{score}%</strong>
                      </div>
                    </div>
                  </div>
                  <div className="listing-price">
                    <div>
                      <strong>
                        <span>¥</span>
                        {listing.price}
                      </strong>
                      <small>/月</small>
                    </div>
                    <button
                      className={selected ? "selected-button" : "text-button"}
                      onClick={() => toggleShortlist(listing.id)}
                    >
                      {selected ? "已加入带看 ✓" : "加入带看 →"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
        </>
      )}

      {activeView === "knowledge" && (
        <>
          <section className="page-heading knowledge-heading">
            <div>
              <p className="eyebrow">官方线路 × 公开资料初筛 × 你的实地核价</p>
              <h1>沿线配房知识库</h1>
              <p>
                已覆盖2、5、7、19号线全部运营站，先找候选，再用真实步行和你的价格经验复核。
              </p>
            </div>
            <div className="heading-stats">
              <div>
                <strong>{stationCoverage.uniqueStations}</strong>
                <span>个唯一站点</span>
              </div>
              <div>
                <strong>{stationCoverage.candidateCount}</strong>
                <span>个小区/公寓候选</span>
              </div>
            </div>
          </section>

          <section className="knowledge-panel">
            <div className="knowledge-toolbar">
              <div className="line-filter" aria-label="线路筛选">
                {["全部", "2号线", "5号线", "7号线", "19号线"].map(
                  (line) => (
                    <button
                      key={line}
                      className={knowledgeLine === line ? "active" : ""}
                      onClick={() => {
                        setKnowledgeLine(line);
                        setKnowledgeLimit(18);
                      }}
                    >
                      {line}
                    </button>
                  ),
                )}
              </div>
              <label className="knowledge-search">
                <span>⌕</span>
                <input
                  value={knowledgeQuery}
                  onChange={(event) => {
                    setKnowledgeQuery(event.target.value);
                    setKnowledgeLimit(18);
                  }}
                  placeholder="搜站点、小区或公寓"
                />
              </label>
            </div>

            <div className="route-map" aria-label="站点关系">
              {Object.entries(lineStops)
                .filter(
                  ([line]) =>
                    knowledgeLine === "全部" || knowledgeLine === line,
                )
                .map(([line, stops]) => (
                  <div className="route-row" key={line}>
                    <span
                      className="route-line-label"
                      style={{ backgroundColor: lineColors[line] }}
                    >
                      {line}
                    </span>
                    <div
                      className="route-stops"
                      style={
                        {
                          "--route-color": lineColors[line],
                        } as React.CSSProperties
                      }
                    >
                      {stops.map((station) => (
                        <button
                          key={station}
                          className={
                            station === knowledgeQuery ? "active" : ""
                          }
                          onClick={() => {
                            setKnowledgeQuery(station);
                            setKnowledgeLimit(18);
                          }}
                        >
                          <span />
                          {station}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="knowledge-source-note">
              <span>i</span>
              <p>
                已核对 {stationCoverage.lineStationCount} 个线站次（换乘站合并为{" "}
                {stationCoverage.uniqueStations} 个卡片）。公开资料只用于发现约
                1–1.5公里内的候选，不代表实时出租、成交价或真实步行距离；“师傅已核对”才使用你的本地经验价。
              </p>
            </div>

            <div className="research-method">
              <div>
                <span>①</span>
                <div>
                  <strong>地铁位置</strong>
                  <p>杭州地铁官网核对线路、站名和站口；高德用于核对实际方位。</p>
                </div>
              </div>
              <div>
                <span>②</span>
                <div>
                  <strong>候选小区</strong>
                  <p>先收集站点周边小区、公寓和商住，再排除同名与跨板块结果。</p>
                </div>
              </div>
              <div>
                <span>③</span>
                <div>
                  <strong>价格分层</strong>
                  <p>平台挂牌只做快照；最终参考价以你的有效房源和师傅核价为准。</p>
                </div>
              </div>
            </div>

            <div className="knowledge-grid">
              {visibleKnowledge.map((entry) => {
                const snapshots = publicSnapshotsByStation[entry.station] ?? [];
                const mentorRecords =
                  mentorRecordsByStation[entry.station] ?? [];
                return (
                <article className="knowledge-card" key={entry.id}>
                  <div className="knowledge-card-head">
                    <div>
                      <div className="line-badges">
                        {entry.lines.map((line) => (
                          <span
                            key={line}
                            style={{
                              backgroundColor: lineColors[line] ?? "#0f8a6a",
                            }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                      <h2>{entry.station}</h2>
                      <p className="knowledge-district">{entry.district}</p>
                    </div>
                    <span
                      className={`verification ${
                        entry.verification === "师傅已核对"
                          ? "verified"
                          : entry.verification === "待补充"
                            ? "pending"
                            : ""
                      }`}
                    >
                      {entry.verification}
                    </span>
                  </div>

                  <div className="knowledge-price">
                    <span>你的实地参考价</span>
                    <strong>
                      {formatKnowledgePrice(entry, mentorRecords)}
                    </strong>
                    <small>
                      {mentorRecords.length > 0
                        ? `${mentorRecords.length}条师傅经验记录 · 单人居住口径`
                        : entry.price
                        ? entry.price.label
                        : "等待你补充单间 / 整租 / 公寓价格"}
                    </small>
                  </div>

                  <div className="knowledge-groups">
                    <div>
                      <h3>小区</h3>
                      <div className="knowledge-tags">
                        {entry.communities.length > 0 ? (
                          entry.communities.map((name) => (
                            <span key={name}>{name}</span>
                          ))
                        ) : (
                          <em>待补充</em>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3>公寓 / 商住</h3>
                      <div className="knowledge-tags apartment">
                        {entry.apartments.length > 0 ? (
                          entry.apartments.map((name) => (
                            <span key={name}>{name}</span>
                          ))
                        ) : (
                          <em>待补充</em>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="knowledge-notes">
                    {entry.notes.map((note) => (
                      <p key={note}>✓ {note}</p>
                    ))}
                  </div>
                  {mentorRecords.length > 0 && (
                    <div className="mentor-rent-records">
                      <div className="mentor-rent-heading">
                        <div>
                          <h3>师傅经验价 · 单人居住</h3>
                          <p>隔断单间、小一居或公寓；不是整租套房价</p>
                        </div>
                        <span>更新 2026-07-29</span>
                      </div>
                      {mentorRecords.map((record, index) => (
                        <div
                          className="mentor-rent-record"
                          key={`${record.project}-${record.room}-${index}`}
                        >
                          <div>
                            <strong>{record.project}</strong>
                            <span>{record.room}</span>
                          </div>
                          <b>
                            ¥{record.min}
                            {record.max !== record.min
                              ? `–${record.max}`
                              : ""}
                            /月
                          </b>
                          <p>{record.details.join(" · ")}</p>
                          {record.warning && <small>{record.warning}</small>}
                        </div>
                      ))}
                    </div>
                  )}
                  {snapshots.length > 0 && (
                    <div className="rent-snapshots">
                      <h3>公开挂牌快照（不等于参考价）</h3>
                      {snapshots.map((snapshot) => (
                        <a
                          key={`${snapshot.station}-${snapshot.project}`}
                          href={snapshot.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div>
                            <strong>{snapshot.project}</strong>
                            <span>
                              {snapshot.room} · ¥{snapshot.min}
                              {snapshot.max !== snapshot.min
                                ? `–${snapshot.max}`
                                : ""}
                              /月
                            </span>
                          </div>
                          <small>
                            {snapshot.source} · {snapshot.observedAt}
                            {snapshot.warning
                              ? ` · ${snapshot.warning}`
                              : ""}
                          </small>
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="research-actions" aria-label="外部核验入口">
                    <a
                      href={buildMapSearchUrl(entry.station)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      高德核位 ↗
                    </a>
                    <a
                      href={buildBeikeSearchUrl(entry.station)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      贝壳核价 ↗
                    </a>
                    <a
                      href={buildAnjukeSearchUrl(entry.station)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      安居客核价 ↗
                    </a>
                  </div>
                  <div className="knowledge-source-row">
                    <small className="knowledge-source">
                      来源：{entry.source} · {entry.researchedAt}
                    </small>
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      查来源 ↗
                    </a>
                  </div>
                </article>
                );
              })}
            </div>

            {visibleKnowledge.length < filteredKnowledge.length && (
              <div className="knowledge-load-more">
                <span>
                  已显示 {visibleKnowledge.length} / {filteredKnowledge.length} 个站点
                </span>
                <button
                  className="secondary-button"
                  onClick={() => setKnowledgeLimit((current) => current + 18)}
                >
                  再看18个站点
                </button>
              </div>
            )}

            {filteredKnowledge.length === 0 && (
              <div className="knowledge-empty">
                没找到对应记录，换个关键词或线路试试。
              </div>
            )}
          </section>
        </>
      )}

      {activeView === "listings" && (
        <>
          <section className="page-heading library-heading">
            <div>
              <p className="eyebrow">地图房源先入库 · 价格以后补</p>
              <h1>我的房源库</h1>
              <p>地图调研项目与真实可带看现房分层管理，两类都会参与配房。</p>
            </div>
            <div className="heading-stats">
              <div>
                <strong>{mapListings.length}</strong>
                <span>地图待核价</span>
              </div>
              <div>
                <strong>
                  {listings.filter((listing) => listing.status === "可带看").length}
                </strong>
                <span>当前可带看</span>
              </div>
            </div>
          </section>

          <section className="library-panel">
            <div className="library-mode-tabs" aria-label="房源库类型">
              <button
                className={libraryMode === "map" ? "active" : ""}
                onClick={() => setLibraryMode("map")}
              >
                地图待核价
                <span>{mapListings.length}</span>
              </button>
              <button
                className={libraryMode === "live" ? "active" : ""}
                onClick={() => setLibraryMode("live")}
              >
                现房 / 实际房源
                <span>{listings.length}</span>
              </button>
            </div>

            <div className="library-toolbar">
              <div>
                <h2>
                  {libraryMode === "map" ? "地图房源明细" : "现房明细"}
                </h2>
                <p>
                  {libraryMode === "map"
                    ? "小区和公寓已经全部入库，价格、户型、距离和当前可租状态可后续补充。"
                    : "现房自动保存在当前浏览器；建议每天带看前更新状态。"}
                </p>
              </div>
              <div className="toolbar-actions">
                <input
                  ref={fileInputRef}
                  className="visually-hidden"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importListings(file);
                    event.currentTarget.value = "";
                  }}
                />
                {libraryMode === "map" ? (
                  <button
                    className="secondary-button toolbar-button"
                    onClick={exportMapListings}
                  >
                    导出{mapListings.length}条待核价房源
                  </button>
                ) : (
                  <>
                    <button className="ghost-outline" onClick={downloadTemplate}>
                      下载模板
                    </button>
                    <button className="ghost-outline" onClick={exportListings}>
                      导出现房
                    </button>
                    {listings.some((listing) =>
                      demoListingTitles.has(listing.title),
                    ) && (
                      <button
                        className="danger-ghost"
                        onClick={removeDemoListings}
                      >
                        移除演示房源
                      </button>
                    )}
                    <button
                      className="secondary-button toolbar-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      导入 Excel
                    </button>
                    <button
                      className="primary-button small"
                      onClick={() => setShowAddListing(true)}
                    >
                      ＋ 添加现房
                    </button>
                  </>
                )}
              </div>
            </div>

            {libraryMode === "map" ? (
              <>
                <div className="map-library-filters">
                  <div className="line-filter">
                    {["全部", "2号线", "5号线", "7号线", "19号线"].map(
                      (line) => (
                        <button
                          key={line}
                          className={mapListingLine === line ? "active" : ""}
                          onClick={() => {
                            setMapListingLine(line);
                            setMapListingLimit(40);
                          }}
                        >
                          {line}
                        </button>
                      ),
                    )}
                  </div>
                  <label className="knowledge-search">
                    <span>⌕</span>
                    <input
                      value={mapListingQuery}
                      onChange={(event) => {
                        setMapListingQuery(event.target.value);
                        setMapListingLimit(40);
                      }}
                      placeholder="搜房源、地铁站或板块"
                    />
                  </label>
                </div>

                <div className="map-library-summary">
                  <strong>{filteredMapListings.length}</strong>
                  <span>条地图房源关系</span>
                  <p>
                    同一个项目靠近多个站时会分别保留，方便按客户目标站参与匹配。
                  </p>
                </div>

                <div className="map-library-list">
                  <div className="map-library-head">
                    <span>房源项目</span>
                    <span>类型 / 价格</span>
                    <span>地铁位置</span>
                    <span>核验状态</span>
                    <span>操作</span>
                  </div>
                  {filteredMapListings
                    .slice(0, mapListingLimit)
                    .map((listing) => (
                      <article className="map-library-row" key={listing.id}>
                        <div>
                          <h3>{listing.title}</h3>
                          <p>{listing.district}</p>
                        </div>
                        <div>
                          <span
                            className={`project-kind ${
                              listing.kind === "小区" ? "" : "apartment"
                            }`}
                          >
                            {listing.kind}
                          </span>
                          <b>
                            {listing.mentorRecords.length > 0
                              ? `¥${Math.min(
                                  ...listing.mentorRecords.map(
                                    (record) => record.min,
                                  ),
                                )}–${Math.max(
                                  ...listing.mentorRecords.map(
                                    (record) => record.max,
                                  ),
                                )}`
                              : "价格待补"}
                          </b>
                          {listing.mentorRecords.length > 0 && (
                            <small>
                              {listing.mentorRecords
                                .map((record) => record.room)
                                .join(" / ")}
                            </small>
                          )}
                        </div>
                        <div>
                          <strong>{listing.lines.join(" / ")}</strong>
                          <span>{listing.station}站周边</span>
                        </div>
                        <div>
                          <span
                            className={`verification ${
                              listing.verification === "师傅已核对"
                                ? "verified"
                                : listing.verification === "待补充"
                                  ? "pending"
                                  : ""
                            }`}
                          >
                            {listing.mentorRecords.length > 0
                              ? "师傅已核对"
                              : listing.verification}
                          </span>
                          <small>
                            {listing.mentorRecords[0]?.observedAt ??
                              listing.researchedAt}
                          </small>
                        </div>
                        <button
                          className="text-button"
                          onClick={() => {
                            setKnowledgeQuery(listing.title);
                            setKnowledgeLine("全部");
                            setActiveView("knowledge");
                          }}
                        >
                          查看站点资料 →
                        </button>
                      </article>
                    ))}
                </div>

                {mapListingLimit < filteredMapListings.length && (
                  <div className="knowledge-load-more">
                    <span>
                      已显示 {mapListingLimit} / {filteredMapListings.length} 条
                    </span>
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setMapListingLimit((current) => current + 40)
                      }
                    >
                      再看40条
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="library-list">
                <div className="library-list-head">
                  <span>房源</span>
                  <span>租金 / 户型</span>
                  <span>交通</span>
                  <span>标签</span>
                  <span>状态</span>
                </div>
                {listings.map((listing) => (
                  <article className="library-row" key={listing.id}>
                    <div className="library-home">
                      <div
                        className="library-thumb"
                        style={{ backgroundImage: `url(${listing.image})` }}
                      />
                      <div>
                        <h3>{listing.title}</h3>
                        <p>
                          {listing.area} · {listing.updated}更新
                        </p>
                      </div>
                    </div>
                    <div className="library-price">
                      <strong>¥{listing.price}</strong>
                      <span>{listing.room}</span>
                    </div>
                    <div className="library-location">
                      <strong>{listing.metro}</strong>
                      <span>{listing.location}</span>
                    </div>
                    <div className="listing-tags">
                      {listing.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <select
                      className={`status-select status-${listing.status}`}
                      aria-label={`${listing.title}状态`}
                      value={listing.status}
                      onChange={(event) =>
                        setListings((current) =>
                          current.map((item) =>
                            item.id === listing.id
                              ? {
                                  ...item,
                                  status: event.target
                                    .value as Listing["status"],
                                  updated: "刚刚",
                                }
                              : item,
                          ),
                        )
                      }
                    >
                      <option>可带看</option>
                      <option>待确认</option>
                      <option>已租</option>
                    </select>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeView === "records" && (
        <>
          <section className="page-heading records-heading">
            <div>
              <p className="eyebrow">从配房到带看，每次推荐都有记录</p>
              <h1>匹配记录</h1>
              <p>保存客户的候选房源，一键整理成可以直接发送的文字清单。</p>
            </div>
            <div className="heading-stats">
              <div>
                <strong>{records.length}</strong>
                <span>次配房记录</span>
              </div>
              <div>
                <strong>{shortlist.length}</strong>
                <span>套当前候选</span>
              </div>
            </div>
          </section>

          <section className="records-panel">
            {records.length === 0 ? (
              <div className="empty-state">
                <span>⌂</span>
                <h2>还没有保存过配房清单</h2>
                <p>回到客户需求页，选中房源后点击“保存清单”。</p>
                <button
                  className="primary-button"
                  onClick={() => setActiveView("match")}
                >
                  去给客户配房
                </button>
              </div>
            ) : (
              <div className="record-grid">
                {records.map((record) => {
                  const recordListings = record.listingIds
                    .map((id) => listings.find((listing) => listing.id === id))
                    .filter((listing): listing is Listing => Boolean(listing));
                  return (
                    <article className="record-card" key={record.id}>
                      <div className="record-head">
                        <div>
                          <span className="section-kicker">客户配房清单</span>
                          <h2>{record.client}</h2>
                          <p>{record.createdAt} · {recordListings.length}套候选</p>
                        </div>
                        <button
                          className="copy-button"
                          onClick={() => void copyRecord(record)}
                        >
                          复制发客户
                        </button>
                      </div>
                      <div className="record-listings">
                        {recordListings.map((listing, index) => (
                          <div className="record-listing" key={listing.id}>
                            <span className="record-index">{index + 1}</span>
                            <div>
                              <strong>{listing.title}</strong>
                              <small>{listing.area} · {listing.location}</small>
                            </div>
                            <b>¥{listing.price}/月</b>
                            <span
                              className={`availability availability-${listing.status}`}
                            >
                              {listing.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {showAddListing && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddListing(false);
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-listing-title"
          >
            <div className="modal-head">
              <div>
                <span className="section-kicker">录入真实房源</span>
                <h2 id="add-listing-title">添加房源</h2>
              </div>
              <button
                className="close-button"
                aria-label="关闭"
                onClick={() => setShowAddListing(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-form">
              <label className="wide">
                房源名称
                <input
                  placeholder="例如：盈一佳苑 · 朝南一室"
                  value={listingDraft.title}
                  onChange={(event) =>
                    setListingDraft({ ...listingDraft, title: event.target.value })
                  }
                />
              </label>
              <label>
                月租
                <input
                  type="number"
                  value={listingDraft.price}
                  onChange={(event) =>
                    setListingDraft({
                      ...listingDraft,
                      price: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                区域 / 板块
                <input
                  placeholder="例如：盈丰街道"
                  value={listingDraft.area}
                  onChange={(event) =>
                    setListingDraft({ ...listingDraft, area: event.target.value })
                  }
                />
              </label>
              <label className="wide">
                位置 / 地铁距离
                <input
                  placeholder="例如：距7号线盈丰路站520m"
                  value={listingDraft.location}
                  onChange={(event) =>
                    setListingDraft({
                      ...listingDraft,
                      location: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                地铁线
                <select
                  value={listingDraft.metro}
                  onChange={(event) =>
                    setListingDraft({ ...listingDraft, metro: event.target.value })
                  }
                >
                  <option>7号线</option>
                  <option>2号线</option>
                  <option>5号线</option>
                  <option>19号线</option>
                  <option>不限</option>
                </select>
              </label>
              <label>
                预计通勤（分钟）
                <input
                  type="number"
                  value={listingDraft.commute}
                  onChange={(event) =>
                    setListingDraft({
                      ...listingDraft,
                      commute: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                户型
                <select
                  value={listingDraft.room}
                  onChange={(event) =>
                    setListingDraft({ ...listingDraft, room: event.target.value })
                  }
                >
                  <option>整租一室</option>
                  <option>合租主卧</option>
                  <option>合租次卧</option>
                  <option>一室一厅</option>
                  <option>两室一厅</option>
                </select>
              </label>
              <label>
                房源状态
                <select
                  value={listingDraft.status}
                  onChange={(event) =>
                    setListingDraft({
                      ...listingDraft,
                      status: event.target.value as Listing["status"],
                    })
                  }
                >
                  <option>可带看</option>
                  <option>待确认</option>
                  <option>已租</option>
                </select>
              </label>
              <label className="wide">
                标签（用顿号分隔）
                <input
                  placeholder="独立厨卫、民水民电、8月可入住"
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="ghost-button"
                onClick={() => setShowAddListing(false)}
              >
                取消
              </button>
              <button className="primary-button" onClick={addListing}>
                保存房源
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
