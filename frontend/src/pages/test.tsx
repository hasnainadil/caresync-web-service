import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { API_URLS } from "@/lib/api-urls";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TestPage: React.FC = () => {
    // test all api endpoint functions
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useAuth();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-200 p-5">

            <h1 className="text-4xl font-bold">API Test Page</h1>
            <p className="text-xl text-gray-600">Testing API endpoints...</p>
            <div className="flex flex-row gap-4">
                <button className="p-2 bg-white text-black rounded-lg border-black"
                    onClick={async () => {
                        try {
                            const user = auth.user;
                            const token = user ? await user.getIdToken() : null;
                            setAccessToken(token);
                            apiClient.setToken(token);
                        } catch (error) {
                            setApiResponse(error);
                        }
                    }}
                >
                    check access token
                </button>
                <p className={cn("mt-4 break-all", accessToken ? "text-green-500" : "text-red-500")}>{accessToken ? "Access Token Initialized" : "No Access Token Available"}</p>
            </div>
            <div className="flex flex-row w-full flex-1 gap-4">
                <div className="flex flex-col gap-4 w-1/3 flex-1 overflow-auto h-[550px]">
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.auth_service.testEndpoint}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await apiClient.testAuthEndpoint();
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Test Endpoint
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.auth_service.registerUser}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    if (!auth.user) {
                                        throw new Error("User is not authenticated");
                                    }
                                    if (!accessToken) {
                                        throw new Error("Access token is not available");
                                    }
                                    console.log("Registering user with access token:", accessToken);
                                    console.log("User ID:", auth.user.uid);
                                    const response = await apiClient.registerUser({
                                        userId: auth.user?.uid,
                                        name: "Test User",
                                        email: auth.user?.email || "test@example.com",
                                        password: "cygniV&404",
                                        location: {
                                            locationType: "USER",
                                            address: "123 Test Street",
                                            thana: "Test Thana",
                                            po: "Test PO",
                                            city: "Test City",
                                            postalCode: 123456,
                                            zoneId: 1
                                        },
                                        accessToken: accessToken
                                    });
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Register User
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.auth_service.login}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await apiClient.userLoggedIn(auth.user?.uid || "");
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            User Logged In
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.auth_service.getUserById(auth.user?.uid || "")}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await apiClient.getUserById(auth.user?.uid || "");
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Get User By ID
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.auth_service.updateUser}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await apiClient.updateUser({
                                        id: auth.user?.uid || "",
                                        name: "Updated Test User",
                                        email: auth.user?.email || "",
                                        passwordHash: "cygniV&404"
                                    });
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Update User
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md">
                        <span className="border-black border-l px-2 py-1 shadow-inner bg-white text-black break-all">
                            {API_URLS.data_service.getAllHospitals}
                        </span>
                        <button className="p-2 bg-gray-200 text-black rounded-lg border-black"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await apiClient.getAllHospitals();
                                    setApiResponse(response);
                                } catch (error) {
                                    setApiResponse(error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Get All Hospitals
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full flex-1">
                        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                    </div>
                ) : (
                    <pre className=" bg-white p-4 rounded shadow-md w-2/3 break-all text-wrap">
                        {apiResponse ? JSON.stringify(apiResponse, null, 2) : "No response yet."}
                    </pre>
                )}
            </div>

        </div>
    )
}

export default TestPage;