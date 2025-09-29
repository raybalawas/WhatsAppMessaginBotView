import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { getUserCampaignsUrl } from "../../../utils/apiConfig";

function CampaignListPage() {
  const { id } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaignId, setLoadingCampaignId] = useState(null);
  useEffect(() => {
    const fetchCamps = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("authUserId"); // Stored during login
      if (!token || !userId) {
        alert("You must be logged in to view campaigns.");
        return;
      }

      try {
        const res = await axios.get(
          `https://whatsappmessaginbot.onrender.com/api/users/get-camp-by-user-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200 && res.data.Data && res.data.Data.length > 0) {
          setCampaigns(res.data.Data);
        } else if (
          res.status === 200 &&
          (!res.data.Data || res.data.Data.length === 0)
        ) {
          alert("No campaigns found for this user.");
          setCampaigns([]);
        } else {
          alert(res.data.Message || "Unexpected response from server.");
        }
      } catch (error) {
        // Handle validation and API errors gracefully
        if (error.response) {
          // API returned a known error response
          console.error("API Error:", error.response.data);
          alert(error.response.data.Message || "Failed to fetch campaigns.");
        } else {
          // Network or other errors
          console.error("Error:", error.message);
          alert("Network error. Please try again later.");
        }
      }
    };

    fetchCamps();
  }, [id]);

  // const handleLaunchCampaign = async (camp) => {
  //   const userId = id;
  //   alert(userId);
  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     alert("You must be logged in to perform this action.");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("userId", userId);
  //   formData.append("message", camp.message);
  //   formData.append("csvfile", camp.csvFilePath); // If your API expects a file upload, you'll need to fetch file differently

  //   if (camp.anyDesignFile) {
  //     formData.append("design", camp.anyDesignFile);
  //   }

  //   // alert(token);
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:3000/api/whatsapp/whatsapp-message-send", // Your API endpoint
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (res.data.status === "success") {
  //       alert(
  //         `Campaign launched successfully! Sent ${res.data.sent} messages.`
  //       );
  //     } else {
  //       alert(`Failed to launch campaign: ${res.data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Launch Campaign Error:", error.response || error.message);
  //     alert("Server error. Please try again later.");
  //   }
  // };

  const handleLaunchCampaign = async (camp) => {
    const userId = id;
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    try {
      setLoadingCampaignId(camp._id); // Disable this specific button

      const res = await axios.post(
        `https://whatsappmessaginbot.onrender.com/api/whatsapp/whatsapp-message-send`,
        {
          userId,
          messageId: camp._id,
          message: camp.message,
          csvFileUrl: camp.csvFilePath,
          designFileUrl: camp.anyDesignFile || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        alert(
          `Campaign launched successfully! Sent ${res.data.sent} messages.`
        );
        window.location.reload(); // Refresh to show updated status
        // ✅ Update local state so button gets disabled
        setCampaigns((prev) =>
          prev.map((c) =>
            c._id === camp._id ? { ...c, status: "completed" } : c
          )
        );
      } else {
        alert(`Failed to launch campaign: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Launch Campaign Error:", error.response || error.message);
      alert("Server error. Please try again later.");
    }
  };

  const handleDeleteCampaign = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/users/delete-all-campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("All campaigns deleted successfully!");
        window.location.reload(); // Refresh to show updated status
        setCampaigns([]); // Clear state since everything is deleted
      } else {
        alert(`Failed to delete campaigns: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Delete Campaign Error:", error.response || error.message);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="main-content">
      <div className="reports-container">
        <h1>📊 Merchants wise Campaigns</h1>
        <button onClick={handleDeleteCampaign}>Delete All Campaigns</button>
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Camp ID</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>User Mobile</th>
                <th>Camp Message</th>
                <th>Camp Video/Image etc.</th>
                <th>Camp Mobile Numbers</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp._id}>
                  <td>{camp._id}</td>
                  <td>{camp.userId._id}</td>
                  <td>{camp.userId.name}</td>
                  <td>{camp.userId.email}</td>
                  <td>{camp.userId.mobile}</td>
                  <td>{camp.message}</td>
                  <td>
                    {camp.anyDesignFile ? (
                      <a
                        href={camp.anyDesignFile}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Creative
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {camp.csvFilePath ? (
                      <a
                        href={camp.csvFilePath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Mobile Numbers
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{camp.status}</td>
                  <td className="Action">
                    {/* <button
                      className="launch"
                      onClick={() => handleLaunchCampaign(camp)}
                      disabled={loadingCampaignId === camp._id}
                    >
                      {loadingCampaignId === camp._id
                        ? "Launching..."
                        : "Launch Campaign"}
                    </button> */}
                    {camp.status === "pending" ||
                    camp.status === "processing" ? (
                      <button
                        className="launch"
                        onClick={() => handleLaunchCampaign(camp)}
                        disabled={loadingCampaignId === camp._id}
                      >
                        {loadingCampaignId === camp._id
                          ? "Launching..."
                          : "Launch Campaign"}
                      </button>
                    ) : (
                      <button className="launched-btn" disabled>
                        Launched
                      </button>
                    )}
                    <button className="edit">Edit</button>
                    <button className="delete">Delete</button>
                  </td>
                </tr>
              ))}

              {campaigns.length === 0 && (
                <tr>
                  <td colSpan="7">No campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CampaignListPage;
