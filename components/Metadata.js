function Metadata(src, metaPath) {
  if (!src || !metaPath) return;

  const fsUtils = utils.fs;
  const { page } = ctx;
  
  const realSrc = fsUtils.realpath(src).replaceAll("\\", "/");
  const realMetaPath = fsUtils.realpath(metaPath).replaceAll("\\", "/");
  
  let i = -1;
  for (let j = 0, lim = Math.min(realSrc.length, realMetaPath.length); j < lim; ++j) {
    const c = realSrc.charAt(j);
    if (c !== realMetaPath.charAt(j)) break;
    if (c === '/') i = j;
  }
  
  let result;

  if (fsUtils.exists(metaPath)) {
    const json = JSON.parse(fsUtils.readFile(metaPath));
    const key = i >= 0 ? realSrc.substring(i + 1) : src;
    result = json[key];
  }

  return result || {}
}
