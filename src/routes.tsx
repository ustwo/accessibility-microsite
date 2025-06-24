import type { RouteObject } from 'react-router-dom';
import Root from './Root';
import Error from './Error';
import Index from './routes/Index';
import ToolsIndex from './routes/tools/Index';
import PatternsIndex from './routes/patterns/Index';
import ScreenReaderGuideIndex from './routes/screen-reader-guide/Index';
import TestSteps from './routes/TestSteps';
import TestSheets from './routes/TestSheets';
import TestJwt from './routes/TestJwt';
import TestPermissions from './routes/TestPermissions';
import SheetsDebug from './routes/SheetsDebug';
import FormSuccess from './routes/FormSuccess';
import TestingTemplatesIndex from './routes/testing-templates/Index';
import ChecklistIndex from './routes/checklist/Index';
import About from './routes/About';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'tools',
        children: [
          {
            index: true,
            element: <ToolsIndex />
          }
        ]
      },
      {
        path: 'patterns',
        children: [
          {
            index: true,
            element: <PatternsIndex />
          }
        ]
      },
      {
        path: 'screen-reader-guide',
        children: [
          {
            index: true,
            element: <ScreenReaderGuideIndex />
          }
        ]
      },
      {
        path: 'checklist',
        children: [
          {
            index: true,
            element: <ChecklistIndex />
          }
        ]
      },
      {
        path: 'testing-templates',
        children: [
          {
            index: true,
            element: <TestingTemplatesIndex />
          }
        ]
      },
      {
        path: 'test-steps',
        element: <TestSteps />
      },
      {
        path: 'test-sheets',
        element: <TestSheets />
      },
      {
        path: 'test-jwt',
        element: <TestJwt />
      },
      {
        path: 'test-permissions',
        element: <TestPermissions />
      },
      {
        path: 'sheets-debug',
        element: <SheetsDebug />
      },
      {
        path: 'form-success',
        element: <FormSuccess />
      }
    ]
  }
]; 