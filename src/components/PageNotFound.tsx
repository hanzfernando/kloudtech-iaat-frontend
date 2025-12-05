import React from "react";
import { Link } from "@tanstack/react-router";

export default function PageNotFound() {
	return (
		<div style={containerStyle}>
			<div style={cardStyle}>
				<div style={badgeStyle}>404</div>
				<h1 style={titleStyle}>Page not found</h1>
				<p style={descStyle}>
					The page you’re looking for doesn’t exist or may have been moved.
				</p>
				<div style={actionsStyle}>
					<Link to="/" style={buttonPrimaryStyle}>
						Go to Dashboard
					</Link>
					<Link to="/" style={buttonGhostStyle}>
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

// Inline styles to avoid adding dependencies; swap with shadcn/ui later
const containerStyle: React.CSSProperties = {
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "#0B1220",
	padding: "24px",
};

const cardStyle: React.CSSProperties = {
	width: "100%",
	maxWidth: "520px",
	backgroundColor: "#0E1526",
	border: "1px solid #1F2A44",
	borderRadius: "12px",
	padding: "24px",
	boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
};

const badgeStyle: React.CSSProperties = {
	display: "inline-block",
	padding: "4px 10px",
	fontSize: "12px",
	lineHeight: 1,
	fontWeight: 600,
	color: "#93C5FD",
	background: "#0A2342",
	border: "1px solid #1E3A8A",
	borderRadius: "9999px",
	marginBottom: "12px",
};

const titleStyle: React.CSSProperties = {
	fontSize: "24px",
	fontWeight: 700,
	color: "#E5E7EB",
	margin: "0 0 8px",
};

const descStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#9CA3AF",
	margin: "0 0 16px",
};

const actionsStyle: React.CSSProperties = {
	display: "flex",
	gap: "12px",
};

const buttonBase: React.CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "10px 14px",
	borderRadius: "8px",
	fontSize: "14px",
	fontWeight: 600,
	textDecoration: "none",
};

const buttonPrimaryStyle: React.CSSProperties = {
	...buttonBase,
	backgroundColor: "#2563EB",
	color: "white",
	border: "1px solid #1D4ED8",
};

const buttonGhostStyle: React.CSSProperties = {
	...buttonBase,
	backgroundColor: "transparent",
	color: "#93C5FD",
	border: "1px solid #1F2A44",
};
