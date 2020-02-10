/*
 * @Description: create context for a component
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 23:31:29
 * @LastEditTime: 2019-07-21 23:35:29
 * @LastEditors: Kevin
 */

import { createContext } from 'react';

export const Context = createContext({});

export const { Provider, Consumer } = Context;

export default Context;
