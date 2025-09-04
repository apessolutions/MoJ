export async function parallel<T>(tasks: Promise<T>[]) {
  return await Promise.all(tasks);
}
