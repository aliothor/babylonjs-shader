import type {
    Geometry, Position, FeatureCollection, Feature, BBox, MultiLineString, MultiPolygon, Point, LineString, Polygon
} from 'geojson'

import bbox from './bbox';

export function flatCoordinates(geojson: FeatureCollection<Polygon | MultiPolygon | LineString | MultiLineString>, scale?: number) {
    const [minx, miny, maxx, maxy] = bbox(geojson);
    const centerX = (minx + maxx) / 2, centerY = (miny + maxy) / 2;
    const dx = maxx - minx, dy = maxy - miny;
    const max = Math.max(dx, dy);
    scale = scale ?? 160 / max;
    geojson.features.forEach(feature => {
        const { coordinates, type } = feature.geometry;
        if (['MultiLineString', 'Polygon'].includes(type)) {
            coordinates.forEach(coord => {
                coord.forEach((c: any) => {
                    c[0] -= centerX;
                    c[1] -= centerY;
                    c[0] *= scale;
                    c[1] *= scale;
                });
            });

        }
        if (type === 'MultiPolygon') {
            coordinates.forEach(coords => {
                coords.forEach(coord => {
                    coord.forEach(c => {
                        c[0] -= centerX;
                        c[1] -= centerY;
                        c[0] *= scale;
                        c[1] *= scale;
                    });
                });
            });
        }
        if (type === 'LineString') {
            coordinates.forEach(c => {
                c[0] -= centerX;
                c[1] -= centerY;
                c[0] *= scale;
                c[1] *= scale;
            });
        }
    });

}