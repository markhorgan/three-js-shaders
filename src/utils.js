import { Vector3, BufferAttribute } from 'three';

const newTypedArray = (type, count) => {
  switch(type) {
    case 'Uint16':
      return new Uint16Array(count);

    case 'Int32':
      return new Int32Array(count);

    case 'Float32':
      return new Float32Array(count);

    default:
      throw new Error(`Don't know how to handle type ${type}`);
  }
}

const toTypedArray = (array, type, numComponents) => {
  const typedArray = newTypedArray(type, array.length * numComponents);
  array.forEach((item, i) => {
    switch (numComponents) {
      case 1:
        typedArray[i] = item;
        break;

      case 3:
        typedArray[i * 3] = item.x;
        typedArray[i * 3 + 1] = item.y;
        typedArray[i * 3 + 2] = item.z;
        break;

      default:
        throw new Error(`Don't know how to handle ${numComponents} components`)
    }
  });
  return typedArray;
}

const newBufferAttribute = (array, type, numComponents) => {
  const typedArray = toTypedArray(array, type, numComponents);
  return new BufferAttribute(typedArray, numComponents);
}

export const toIndexedVertices = geometry => {
  const uniquePositions = [];
  const indicesById = new Map();
  const indices = [];
  const attribute = geometry.attributes.position;
  let j = 0;
  for (let i = 0; i < attribute.count; i++) {
    const x = attribute.getX(i);
    const y = attribute.getY(i);
    const z = attribute.getZ(i);
    const key = `${x}${y}${z}`;
    const index = indicesById.get(key);
    if (index === undefined) {
      uniquePositions.push(new Vector3(x, y, z));
      indicesById.set(key, j);
      indices.push(j);
      j++;
    } else {
      indices.push(index);
    }
  }
  geometry.attributes.position = newBufferAttribute(uniquePositions, 'Float32', 3);
  geometry.attributes.normal = newBufferAttribute(uniquePositions, 'Float32', 3);
  geometry.index = newBufferAttribute(indices, 'Uint16', 1);
}