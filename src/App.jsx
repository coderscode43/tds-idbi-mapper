import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/component/ErrorPage";
import DefaultRedirect from "./components/navigation/DefaultRedirect";
import PageNotFound from "./components/component/PageNotFound";
import AppLayout from "./layout/AppLayout";
import ImportDeducteeDetails from "./pages/ImportDeducteeDetails";
import SettingPage from "./pages/SettingPage";
import WithDrawal from "./pages/WithDrawal";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Redirect root to dynamic importDeductee route */}
        <Route path="/" element={<DefaultRedirect />} />

        <Route path="home" element={<AppLayout />} errorElement={<ErrorPage />}>
          <Route
            path="listSearch/importDeducteeDetails/:params"
            element={<ImportDeducteeDetails />}
          />
          <Route path="listSearch/withDrawal/:params" element={<WithDrawal />} />
          <Route path="list/settings" element={<SettingPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
        
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
