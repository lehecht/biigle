<?php

namespace Biigle\Http\Controllers\Views\Projects;

use Biigle\Role;
use Biigle\Video;
use Biigle\Project;
use Illuminate\Http\Request;
use Biigle\Http\Controllers\Views\Controller;

class ProjectsController extends Controller
{
    /**
     * Shows the create project page.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', Project::class);

        return view('projects.create');
    }

    /**
     * Shows the project show page.
     *
     * @param Request $request
     * @param int $id project ID
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $this->authorize('access', $project);

        $roles = collect([
            Role::admin(),
            Role::expert(),
            Role::editor(),
            Role::guest(),
        ]);

        $labelTrees = $project->labelTrees()
            ->select('id', 'name', 'description', 'version_id')
            ->with('version')
            ->get();

        $volumes = $project->volumes()
            ->select('id', 'name', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->each(function ($item) {
                $item->append('thumbnailUrl');
                $item->append('thumbnailsUrl');
            });

        $videos = $project->videos()
            ->orderBy('updated_at', 'desc')
            ->get()
            ->each(function ($item) {
                $item->append('thumbnailUrl');
                $item->append('thumbnailsUrl');
            });

        $members = $project->users()
            ->select('id', 'firstname', 'lastname', 'project_role_id as role_id')
            ->orderBy('project_user.project_role_id', 'asc')
            ->get();

        $userProject = $request->user()->projects()->where('id', $id)->first();
        $isMember = $userProject !== null;
        $isPinned = $isMember && $userProject->pivot->pinned;
        $canPin = $isMember && 3 > $request->user()
            ->projects()
            ->wherePivot('pinned', true)
            ->count();

        return view('projects.show', [
            'project' => $project,
            'roles' => $roles,
            'labelTrees' => $labelTrees,
            'volumes' => $volumes,
            'members' => $members,
            'isMember' => $isMember,
            'isPinned' => $isPinned,
            'canPin' => $canPin,
            'videos' => $videos,
        ]);
    }

    /**
     * Shows the project index page.
     *
     * @deprecated This is a legacy route and got replaced by the global search.
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return redirect()->route('search', ['t' => 'projects']);
    }
}
