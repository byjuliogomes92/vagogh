import { useState, useEffect } from "react"
import { Plus, Folder, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { toast } from "@/components/ui/use-toast"

type Folder = {
  id: string
  name: string
  theme: string
}

type JobFoldersProps = {
  onSelectFolder: (folderId: string | null) => void
  selectedFolder: string | null
}

export function JobFolders({ onSelectFolder, selectedFolder }: JobFoldersProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderTheme, setNewFolderTheme] = useState("")
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.id}/jobFolders`))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const folderList: Folder[] = []
        querySnapshot.forEach((doc) => {
          folderList.push({ id: doc.id, ...doc.data() } as Folder)
        })
        setFolders(folderList)
      })

      return () => unsubscribe()
    }
  }, [user])

  const handleAddFolder = async () => {
    if (newFolderName.trim() === "") return

    try {
      await addDoc(collection(db, `users/${user!.id}/jobFolders`), {
        name: newFolderName,
        theme: newFolderTheme || "default",
      })
      setNewFolderName("")
      setNewFolderTheme("")
      setIsAddingFolder(false)
      toast({
        title: "Pasta criada",
        description: "A nova pasta foi criada com sucesso.",
      })
    } catch (error) {
      console.error("Error adding folder: ", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a pasta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditFolder = async () => {
    if (!editingFolder || editingFolder.name.trim() === "") return

    try {
      await updateDoc(doc(db, `users/${user!.id}/jobFolders`, editingFolder.id), {
        name: editingFolder.name,
        theme: editingFolder.theme,
      })
      setEditingFolder(null)
      toast({
        title: "Pasta atualizada",
        description: "A pasta foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error("Error updating folder: ", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a pasta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pasta?")) return

    try {
      await deleteDoc(doc(db, `users/${user!.id}/jobFolders`, folderId))
      toast({
        title: "Pasta excluída",
        description: "A pasta foi excluída com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting folder: ", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pasta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Pastas</h2>
        <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setIsAddingFolder(true)} className="bg-[#7333DD]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Pasta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#1E293B] text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Pasta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="col-span-4"
                  placeholder="Nome da Pasta"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="theme"
                  value={newFolderTheme}
                  onChange={(e) => setNewFolderTheme(e.target.value)}
                  className="col-span-4"
                  placeholder="Tema da Pasta (opcional)"
                />
              </div>
            </div>
            <Button onClick={handleAddFolder} type="button">
              Adicionar Pasta
            </Button>
            <Button onClick={() => setIsAddingFolder(false)} type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        <Button
          variant={selectedFolder === null ? "default" : "outline"}
          className="w-full justify-start bg-[#1E293B]"
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="w-4 h-4 mr-2" />
          Todas as Vagas
        </Button>
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center space-x-2">
            <Button
              variant={selectedFolder === folder.id ? "default" : "outline"}
              className="w-full justify-start bg-[#1E293B]"
              onClick={() => onSelectFolder(folder.id)}
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.name}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setEditingFolder(folder)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#1E293B] text-white">
                <DialogHeader>
                  <DialogTitle>Editar Pasta</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      id="edit-name"
                      value={editingFolder?.name || ""}
                      onChange={(e) => setEditingFolder((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                      className="col-span-4"
                      placeholder="Nome da Pasta"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      id="edit-theme"
                      value={editingFolder?.theme || ""}
                      onChange={(e) => setEditingFolder((prev) => (prev ? { ...prev, theme: e.target.value } : null))}
                      className="col-span-4"
                      placeholder="Tema da Pasta"
                    />
                  </div>
                </div>
                <Button onClick={handleEditFolder}>Salvar Alterações</Button>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteFolder(folder.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

