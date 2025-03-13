"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCatalogRepository = void 0;
class MockCatalogRepository {
    create(data) {
        const mockResponse = Object.assign(Object.assign({}, data), { id: 123 });
        return Promise.resolve(mockResponse);
    }
    update(data) {
        return Promise.resolve(data);
    }
    delete(id) {
        return Promise.resolve(id);
    }
    find(limit, offset) {
        return Promise.resolve([]);
    }
    findOne(id) {
        return Promise.resolve({ id });
    }
}
exports.MockCatalogRepository = MockCatalogRepository;
