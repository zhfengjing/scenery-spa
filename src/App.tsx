import {
	darkTheme,
	lightTheme,
	// midnightTheme,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import Layout from "./components/Layout";
import { config } from "./config/wagmi";
import BuyTokens from "./pages/BuyTokens";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					theme={lightTheme({
					  // ...lightTheme.accentColors.blue,//将强调色设置为内置的green,其他内置的强调色有pink,blue,purple,orange,red
						// accentColor: "#8b5cf6",//自定义强调色
						// accentColorForeground: "white",//自定义
						borderRadius: "medium",//模态框边框圆角 值有large medium,none, small
					  // fontStack:"rounded",//字体堆栈，system, rounded
					  // overlayBlur:"none",//覆盖模糊，none, large small
					})}
				>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route index element={<Home />} />
								<Route path="courses" element={<Courses />} />
								<Route path="courses/:id" element={<CourseDetail />} />
								<Route path="create-course" element={<CreateCourse />} />
								<Route path="profile" element={<Profile />} />
								<Route path="buy-tokens" element={<BuyTokens />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default App;
