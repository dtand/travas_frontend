// Link.react.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import {configure} from 'enzyme';
import { DropTarget } from 'react-dnd';
import DesignArea from '../../components/strategies/design_area';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

