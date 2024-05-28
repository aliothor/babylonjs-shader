import type {
    Geometry, Position, FeatureCollection, Feature, BBox, MultiLineString, MultiPolygon, Point, LineString, Polygon
} from 'geojson'

export default function bbox(geojson: Geometry | Feature | FeatureCollection) {
    let b: BBox = [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
    ];
    switch (geojson.type) {
        case 'FeatureCollection':
            const len = geojson.features.length;
            for (let i = 0; i < len; i++) {
                feature(geojson.features[i], b);
            }
            break;
        case 'Feature':
            feature(geojson, b);
            break;
        default:
            geometry(geojson, b);
            break;
    }
    return b;
}

function feature(f: Feature, b: BBox) {
    geometry(f.geometry, b);
}

function geometry(g: Geometry, b: BBox) {
    if (!g) {
        return;
    }
    switch (g.type) {
        case 'Point':
            point(g.coordinates, b);
            break;
        case 'MultiPoint':
            line(g.coordinates, b);
            break;
        case 'LineString':
            line(g.coordinates, b);
            break;
        case 'MultiLineString':
            multiline(g.coordinates, b);
            break;
        case 'Polygon':
            polygon(g.coordinates, b);
            break;
        case 'MultiPolygon':
            multipolygon(g.coordinates, b);
            break;
        case 'GeometryCollection':
            const len = g.geometries.length;
            for (let i = 0; i < len; i++) {
                geometry(g.geometries[i], b);
            }
            break;
    }
}

function point(p: Position, b: BBox) {
    b[0] = Math.min(b[0], p[0]);
    b[1] = Math.min(b[1], p[1]);
    b[2] = Math.max(b[2], p[0]);
    b[3] = Math.max(b[3], p[1]);
}

function line(l: Position[], b: BBox) {
    for (let i = 0, len = l.length; i < len; i++) {
        point(l[i], b);
    }
}

function multiline(ml: Position[][], b: BBox) {
    for (let i = 0, len = ml.length; i < len; i++) {
        line(ml[i], b);
    }
}

function polygon(p: Position[][], b: BBox) {
    //Just calculate the outer ring,Don't participate in the calculation of holes
    if (p.length) {
        line(p[0], b);
    }
}

function multipolygon(mp: Position[][][], b: BBox) {
    for (let i = 0, len = mp.length; i < len; i++) {
        polygon(mp[i], b);
    }
}