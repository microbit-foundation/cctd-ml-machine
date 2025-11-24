/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, it, expect } from 'vitest';
import { JSONFeatureProvider } from '../core/featureprovider/JSONFeatureProvider';
import { createFeatureToken } from '../core/featureprovider/FeatureToken';

describe('JSONFeatureProvider', () => {
    it('should get values by string key', () => {
        const provider = new JSONFeatureProvider({ 'testKey': 'testValue' });
        expect(provider.get('testKey')).toBe('testValue');
    });

    it('should return undefined for missing string key', () => {
        const provider = new JSONFeatureProvider({});
        expect(provider.get('missing')).toBeUndefined();
    });

    it('should get values by symbol key', () => {
        const sym = Symbol('test');
        const provider = new JSONFeatureProvider({}, { 'testSym': { id: sym, name: 'testSym' } });
        provider.registerFactory(sym, () => 'factoryValue');
        expect(provider.get(sym)).toBe('factoryValue');
    });

    it('should get values by FeatureToken', () => {
        const token = createFeatureToken('myToken');
        const provider = new JSONFeatureProvider({ 'myToken': 'tokenValue' }, { 'myToken': token });
        expect(provider.get(token)).toBe('tokenValue');
    });

    it('should require throws for missing key', () => {
        const provider = new JSONFeatureProvider({});
        expect(() => provider.require('missing')).toThrow('Missing feature: missing');
    });

    it('should require returns value for existing key', () => {
        const provider = new JSONFeatureProvider({ 'key': 'value' });
        expect(provider.require('key')).toBe('value');
    });

    it('should has returns true for existing key', () => {
        const provider = new JSONFeatureProvider({ 'key': 'value' });
        expect(provider.has('key')).toBe(true);
    });

    it('should has returns false for missing key', () => {
        const provider = new JSONFeatureProvider({});
        expect(provider.has('missing')).toBe(false);
    });

    it('should listKeys includes all keys', () => {
        const token = createFeatureToken('tokenKey');
        const provider = new JSONFeatureProvider({ 'stringKey': 'value' }, { 'tokenKey': token });
        const keys = provider.listKeys();
        expect(keys).toContain('stringKey');
        expect(keys).toContain('tokenKey');
    });

    it('should register a value', () => {
        const provider = new JSONFeatureProvider({});
        provider.register('newKey', 'newValue');
        expect(provider.get('newKey')).toBe('newValue');
    });

    it('should registerFactory a factory', () => {
        const provider = new JSONFeatureProvider({});
        provider.registerFactory('factoryKey', () => 'factoryResult');
        expect(provider.get('factoryKey')).toBe('factoryResult');
    });

    it('should extend with another provider', () => {
        const provider1 = new JSONFeatureProvider({ 'key1': 'value1' });
        const provider2 = new JSONFeatureProvider({ 'key2': 'value2' });
        const extended = provider1.extend(provider2);
        expect(extended.get('key1')).toBe('value1');
        expect(extended.get('key2')).toBe('value2');
        expect(extended.get('missing')).toBeUndefined();
    });

    it('should resolve FeatureToken without name using id', () => {
        const token = { id: Symbol() }; // no name
        const provider = new JSONFeatureProvider({}, { 'fallback': token });
        // Since no name, it should use the id, but since id is symbol, and not in values, but for register
        provider.register(token, 'tokenValue');
        expect(provider.get(token)).toBe('tokenValue');
    });
});
