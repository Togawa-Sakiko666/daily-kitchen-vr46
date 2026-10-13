export const storageKey='kitchen-v1';
export function writeKitchen(storage:Pick<Storage,'setItem'|'getItem'>,data:unknown){
 const text=JSON.stringify(data);storage.setItem(storageKey,text);
 if(storage.getItem(storageKey)!==text)throw new Error('保存校验失败');
}
