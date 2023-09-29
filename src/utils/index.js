import _ from 'lodash';

export const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

//  ex :  const obj = { a: { b: { c: 1 } } }; => { 'a.b.c': 1 } because of the dot notation in the key name

export const updateNestedObjectParser = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedObj = updateNestedObjectParser(obj[key]);
      Object.keys(nestedObj).forEach((nestedKey) => {
        newObj[`${key}.${nestedKey}`] = nestedObj[nestedKey];
      });
    } else {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
