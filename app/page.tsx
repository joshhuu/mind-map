"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Download, Menu, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [audience, setAudience] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const heroRef = useRef<HTMLElement>(null);
  const toolRef = useRef<HTMLElement>(null);
  const [analogiesText, setAnalogiesText] = useState("");

  // Parse analogies into nodes
  const parsedNodes = analogiesText
  .split("\n")
  .filter((line) => line.trim())
  .map((line, index) => ({
    id: `${index + 2}`,
    data: { label: `Analogy ${index + 1}` },
    position: {
      x: 200 + 100 * Math.cos((index / 5) * 2 * Math.PI) || 0,
      y: 150 + 100 * Math.sin((index / 5) * 2 * Math.PI) || 0,
    },
    analogy: line.replace(/^\d+\.?\s*/, ""),
  }));
  // Combine the central concept node with parsed nodes
  const initialNodes = [
    {
      id: "1",
      data: { label: concept || "Central Concept" },
      position: { x: 200, y: 150 },
    },
    ...parsedNodes,
  ];

  const initialEdges = parsedNodes.map((node) => ({
    id: `e1-${node.id}`,
    source: "1",
    target: node.id,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const generateAnalogies = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept, audience }),
    });

    const data = await res.json();
    if (data.analogies) {
      setAnalogiesText(data.analogies);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-sky-50 to-mint-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-lavender-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-lavender-600" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Analogy Explorer
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToTool}
                className="text-gray-700 dark:text-gray-300 hover:text-lavender-600 dark:hover:text-lavender-400 transition-colors"
              >
                Tool
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-lavender-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 space-y-2">
              <button
                onClick={() => {
                  scrollToTool();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-lavender-50 dark:hover:bg-gray-800 rounded-md"
              >
                Tool
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full justify-start"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-lavender-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
          className="absolute top-1/2 -left-40 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-mint-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-lavender-600 via-sky-600 to-mint-600 bg-clip-text text-transparent">
                Mindmap-Based
              </span>
              <br />
              Analogy Explorer
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Turn abstract ideas into unforgettable visuals
            </p>
          </motion.div>

          {/* Mindmap Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative w-full max-w-md mx-auto h-64 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-lavender-200 dark:border-gray-700 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Connections */}
                <g
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-lavender-400 dark:text-lavender-500"
                >
                  <line x1="200" y1="150" x2="100" y2="100" />
                  <line x1="200" y1="150" x2="300" y2="100" />
                  <line x1="200" y1="150" x2="150" y2="200" />
                  <line x1="200" y1="150" x2="250" y2="200" />
                </g>

                {/* Nodes */}
                {parsedNodes.map((node, index) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.id === "1" ? "25" : "20"}
                      fill="currentColor"
                      className={
                        node.id === "1" ? "text-lavender-500" : "text-sky-400"
                      }
                    />
                    <text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      className="text-xs fill-current text-gray-700 dark:text-gray-300"
                    >
                      {node.label}
                    </text>
                  </motion.g>
                ))}
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={scrollToTool}
              size="lg"
              className="bg-gradient-to-r from-lavender-600 to-sky-600 hover:from-lavender-700 hover:to-sky-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section ref={toolRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Complex Ideas
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter any concept and target audience to generate visual analogies
              that make learning intuitive
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-lavender-200 dark:border-gray-700">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="concept"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Concept to Explain
                    </Label>
                    <Input
                      id="concept"
                      placeholder="e.g., Quantum Computing, Machine Learning, Blockchain..."
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      className="bg-white dark:bg-gray-900 border-lavender-300 dark:border-gray-600 focus:border-lavender-500 dark:focus:border-lavender-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="audience"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Target Audience
                    </Label>
                    <Select value={audience} onValueChange={setAudience}>
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-lavender-300 dark:border-gray-600 focus:border-lavender-500 dark:focus:border-lavender-400">
                        <SelectValue placeholder="Select audience type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">A 10-year-old</SelectItem>
                        <SelectItem value="teenager">A teenager</SelectItem>
                        <SelectItem value="college">College student</SelectItem>
                        <SelectItem value="professional">
                          Working professional
                        </SelectItem>
                        <SelectItem value="founder">Startup founder</SelectItem>
                        <SelectItem value="expert">Domain expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={generateAnalogies}
                      className="flex-1 bg-gradient-to-r from-lavender-600 to-sky-600 hover:from-lavender-700 hover:to-sky-700 text-white"
                      disabled={!concept || !audience}
                    >
                      Generate Analogies
                    </Button>
                    <Button
                      variant="outline"
                      className="border-lavender-300 dark:border-gray-600 text-lavender-700 dark:text-lavender-300 hover:bg-lavender-50 dark:hover:bg-gray-800 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* React Flow Mindmap */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-lavender-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Interactive Mindmap
                  </h3>
                  <div className="relative w-full h-80 bg-gradient-to-br from-lavender-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden">
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      fitView
                    >
                      <Background />
                      <Controls />
                      <MiniMap />
                    </ReactFlow>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
