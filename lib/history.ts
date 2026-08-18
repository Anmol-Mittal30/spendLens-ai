"use client";

import type { AuditInput, AuditResult } from "./types";

const DB_NAME = "spendlens-history";
const STORE_NAME = "audits";
const DB_VERSION = 1;

export type StoredAudit = {
  id: string;
  input: AuditInput;
  result: AuditResult;
  shareId: string;
  createdAt: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

export async function saveAudit(input: AuditInput, result: AuditResult, shareId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const record: StoredAudit = {
      id: shareId,
      input,
      result,
      shareId,
      createdAt: new Date().toISOString()
    };
    const request = store.put(record);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}

export async function getHistory(): Promise<StoredAudit[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("createdAt");
    const request = index.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result.reverse());
    tx.oncomplete = () => db.close();
  });
}

export async function getAudit(shareId: string): Promise<StoredAudit | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(shareId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
    tx.oncomplete = () => db.close();
  });
}

export async function deleteAudit(shareId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(shareId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}

export async function clearHistory(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}