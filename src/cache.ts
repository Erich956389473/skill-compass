import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { CacheEntry, ScanCache, DetectedSkill, CoverageAnalysis, SkillCompassConfig } from './types.js';

const CACHE_DIR = join(process.cwd(), '.skill-compass-cache');
const CACHE_FILE = join(CACHE_DIR, 'scan-cache.json');

// ── 确保缓存目录存在 ──

function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// ── 读取缓存 ──

export function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    if (!existsSync(CACHE_FILE)) return null;

    const content = readFileSync(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(content);

    if (!cache[key]) return null;

    const entry = cache[key] as CacheEntry<T>;
    const now = Date.now();

    // 检查是否过期
    if (now - entry.timestamp > entry.ttl) {
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

// ── 写入缓存 ──

export function writeCache<T>(key: string, data: T, ttl: number): void {
  try {
    ensureCacheDir();

    let cache: Record<string, any> = {};
    if (existsSync(CACHE_FILE)) {
      const content = readFileSync(CACHE_FILE, 'utf-8');
      cache = JSON.parse(content);
    }

    cache[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('写入缓存失败:', error);
  }
}

// ── 清除缓存 ──

export function clearCache(): void {
  try {
    if (existsSync(CACHE_FILE)) {
      writeFileSync(CACHE_FILE, '{}', 'utf-8');
    }
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
}

// ── 获取扫描缓存 ──

export function getScanCache(config?: SkillCompassConfig): ScanCache | null {
  if (config?.cacheEnabled === false) return null;

  const ttl = config?.cacheTTL || 5 * 60 * 1000; // 默认 5 分钟
  const entry = readCache<ScanCache>('scan');

  if (!entry) return null;

  return entry.data;
}

// ── 设置扫描缓存 ──

export function setScanCache(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  config?: SkillCompassConfig
): void {
  if (config?.cacheEnabled === false) return;

  const ttl = config?.cacheTTL || 5 * 60 * 1000;
  const cacheData: ScanCache = {
    skills,
    analysis,
    timestamp: Date.now(),
  };

  writeCache('scan', cacheData, ttl);
}

// ── 检查缓存是否有效 ──

export function isCacheValid(config?: SkillCompassConfig): boolean {
  if (config?.cacheEnabled === false) return false;

  const cache = getScanCache(config);
  return cache !== null;
}
