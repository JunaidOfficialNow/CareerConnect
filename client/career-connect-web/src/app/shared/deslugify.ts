export function deslugify(slug: string) {
  let str = slug.replace(/_/g, ' ');
  
  for ( let i = 0; i < str.length; i++ ) {
    if (i == 0)  {
      str = `${str[i].toUpperCase()}${str.substring(1)}`
    }
    if (str[i] === ' ') {
        str = `${str.substring(0, i + 1)}${str[i+1].toUpperCase()}${str.substring(i+2)}`
    }
  }

  return str

}