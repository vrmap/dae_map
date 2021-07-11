function mytoWikimediaCommensUrl(source) {
    if (!source) return "";

    let fileName = "";

    if (source.toUpperCase().startsWith("File:".toUpperCase())) {
        fileName = source.substring(5, source.length);

    }

    else if (
        decodeURI(source)
            .toUpperCase()
            .startsWith("https://commons.wikimedia.org/wiki/File:".toUpperCase())
    )
        fileName = decodeURI(source).substring(40, source.length);
    else if (
        decodeURI(source)
            .toUpperCase()
            .startsWith("http://commons.wikimedia.org/wiki/File:".toUpperCase())
    )
        fileName = decodeURI(source).substring(39, source.length);
    //
    if (!fileName) return "";

    fileName = fileName.replace(/ /g, "_");

    const hash = md5(fileName);

    return `https://upload.wikimedia.org/wikipedia/commons/${hash.substring(
        0,
        1
    )}/${hash.substring(0, 2)}/${fileName}`;
}