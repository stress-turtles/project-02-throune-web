import test from 'node:test';
import assert from 'node:assert/strict';
import {accept,distance,territory,type Point} from './geo.ts';
const loop:Point[]=Array.from({length:21},(_,i)=>({lat:-6.2185+.0012*Math.sin(i*Math.PI/10),lng:106.8025+.0012*Math.cos(i*Math.PI/10),time:100000+i*15000,accuracy:5}));
test('closed loop creates one territory',()=>{assert.ok(distance(loop)>300);assert.ok(territory(loop).area>1000);});
test('open and short runs do not create territories',()=>{assert.equal(territory(loop.slice(0,10)).area,0);assert.equal(territory(loop.slice(0,3)).area,0);});
test('poor accuracy and impossible jumps are rejected',()=>{assert.ok(accept([],{...loop[0],accuracy:100}));assert.ok(accept([loop[0]],{...loop[1],lat:0}));assert.equal(accept([loop[0]],loop[1]),null);});
test('self crossing loop does not create territory',()=>{const points=[[0,0],[.002,.002],[0,.002],[.002,0],[.001,0],[0,0]].map(([lat,lng],i)=>({lat,lng,time:i*100000,accuracy:5}));assert.equal(territory(points).area,0);});
