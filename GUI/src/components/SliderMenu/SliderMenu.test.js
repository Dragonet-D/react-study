import { getMenuMatchedKeys } from './SiderMenu.jsx';

const menu = [
  '/dashboard',
  '/userinfo',
  '/dashboard/name',
  '/userinfo/:id',
  '/userinfo/:id/info',
];

describe('test menu match', () => {
  it('sample path', () => {
    expect(getMenuMatchedKeys(menu, '/dashboard')).toEqual(['/dashboard']);
  });
  it('error path', () => {
    expect(getMenuMatchedKeys(menu, '/dashboardname')).toEqual([]);
  });

  it('Secondary path', () => {
    expect(getMenuMatchedKeys(menu, '/dashboard/name')).toEqual([
      '/dashboard/name',
    ]);
  });

  it('Parameter path', () => {
    expect(getMenuMatchedKeys(menu, '/userinfo/2144')).toEqual([
      '/userinfo/:id',
    ]);
  });

  it('three parameter path', () => {
    expect(getMenuMatchedKeys(menu, '/userinfo/2144/info')).toEqual([
      '/userinfo/:id/info',
    ]);
  });
});
