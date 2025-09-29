export interface DragResult<T> {
  removedIndex: number | null;
  addedIndex: number | null;
  payload: T;
}

export function applyDrag<T>(arr: T[], dragResult: DragResult<T>): T[] {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
}

export function generateItems<T>(
  count: number,
  creator: (index: number) => T
): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(creator(i));
  }
  return result;
}

export function getPrioritySeverity(priority: string): string {
  switch (priority) {
    case "A":
      return "danger";
    case "B":
      return "warning";
    case "C":
      return "info";
    case "D":
      return "success";
    default:
      return "secondary";
  }
}
